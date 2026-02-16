import "dotenv/config";

import { Client } from "pg";

const connectionString = process.env.SUPABASE_DB_URL;

async function main() {
  if (!connectionString) {
    throw new Error(
      "Missing SUPABASE_DB_URL. Use the Supabase connection string from project settings.",
    );
  }

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();

  try {
    const result = await client.query<{ database_name: string }>(
      "select current_database() as database_name;",
    );

    const databaseName = result.rows[0]?.database_name ?? "unknown";

    await client.query(`
      create table if not exists public.profiles (
        id uuid primary key references auth.users(id) on delete cascade,
        email text,
        display_name text,
        avatar_url text,
        role text not null default 'customer',
        status text not null default 'active',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        constraint profiles_role_check check (role in ('customer', 'admin')),
        constraint profiles_status_check check (status in ('active', 'blocked'))
      );
    `);

    await client.query("alter table public.profiles enable row level security;");
    await client.query("grant select, insert, update on table public.profiles to authenticated;");

    await client.query(`
      create or replace function public.set_profiles_updated_at()
      returns trigger
      language plpgsql
      as $$
      begin
        new.updated_at := now();
        return new;
      end;
      $$;
    `);

    await client.query("drop trigger if exists trg_profiles_updated_at on public.profiles;");
    await client.query(`
      create trigger trg_profiles_updated_at
      before update on public.profiles
      for each row
      execute function public.set_profiles_updated_at();
    `);

    await client.query(`
      create or replace function public.protect_profile_system_fields()
      returns trigger
      language plpgsql
      as $$
      begin
        if auth.role() = 'authenticated' and auth.uid() = old.id then
          new.email := old.email;
          new.role := old.role;
          new.status := old.status;
        end if;

        return new;
      end;
      $$;
    `);

    await client.query(
      "drop trigger if exists trg_profiles_protect_system_fields on public.profiles;",
    );
    await client.query(`
      create trigger trg_profiles_protect_system_fields
      before update on public.profiles
      for each row
      execute function public.protect_profile_system_fields();
    `);

    await client.query(`
      create or replace function public.handle_new_auth_user()
      returns trigger
      language plpgsql
      security definer
      set search_path = public
      as $$
      begin
        insert into public.profiles (id, email, display_name, avatar_url, role, status)
        values (new.id, new.email, new.email, null, 'customer', 'active')
        on conflict (id)
        do update set
          email = excluded.email,
          display_name = coalesce(public.profiles.display_name, excluded.display_name),
          updated_at = now();

        return new;
      end;
      $$;
    `);

    await client.query("drop trigger if exists on_auth_user_created on auth.users;");
    await client.query(`
      create trigger on_auth_user_created
      after insert on auth.users
      for each row
      execute function public.handle_new_auth_user();
    `);

    await client.query(`
      create or replace function public.handle_auth_user_email_update()
      returns trigger
      language plpgsql
      security definer
      set search_path = public
      as $$
      begin
        update public.profiles
        set email = new.email,
            updated_at = now()
        where id = new.id;

        return new;
      end;
      $$;
    `);

    await client.query("drop trigger if exists on_auth_user_updated on auth.users;");
    await client.query(`
      create trigger on_auth_user_updated
      after update of email on auth.users
      for each row
      when (old.email is distinct from new.email)
      execute function public.handle_auth_user_email_update();
    `);

    await client.query(`
      insert into public.profiles (id, email, display_name, avatar_url, role, status)
      select id, email, email, null, 'customer', 'active'
      from auth.users
      on conflict (id)
      do update set
        email = excluded.email,
        display_name = coalesce(public.profiles.display_name, excluded.display_name),
        updated_at = now();
    `);

    await client.query(`
      do $$
      begin
        if not exists (
          select 1
          from pg_policies
          where schemaname = 'public'
            and tablename = 'profiles'
            and policyname = 'profiles_select_own'
        ) then
          create policy profiles_select_own
            on public.profiles
            for select
            to authenticated
            using (auth.uid() = id);
        end if;

        if not exists (
          select 1
          from pg_policies
          where schemaname = 'public'
            and tablename = 'profiles'
            and policyname = 'profiles_insert_own'
        ) then
          create policy profiles_insert_own
            on public.profiles
            for insert
            to authenticated
            with check (auth.uid() = id);
        end if;

        if not exists (
          select 1
          from pg_policies
          where schemaname = 'public'
            and tablename = 'profiles'
            and policyname = 'profiles_update_own'
        ) then
          create policy profiles_update_own
            on public.profiles
            for update
            to authenticated
            using (auth.uid() = id)
            with check (auth.uid() = id);
        end if;
      end
      $$;
    `);

    console.log("[supabase] Connection check succeeded.");
    console.log(`[supabase] Database: ${databaseName}`);
    console.log("[supabase] profiles table and auth sync triggers are ready.");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("[supabase] Provision failed:", error.message);
  process.exit(1);
});
