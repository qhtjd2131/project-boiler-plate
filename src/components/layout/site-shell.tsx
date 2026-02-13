import { SiteHeader } from "@/components/layout/site-header";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <footer className="border-t border-border/80 bg-background/80">
        <div className="flex w-full flex-col items-start gap-1 px-4 py-4 text-xs text-muted-foreground tablet:flex-row tablet:items-center tablet:justify-between tablet:px-6 laptop:px-8 desktop:px-12">
          <p>External delivery starter</p>
          <p>Supabase + Sanity + OpenCode</p>
        </div>
      </footer>
    </div>
  );
}
