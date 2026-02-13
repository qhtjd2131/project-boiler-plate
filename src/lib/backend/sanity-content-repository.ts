import "server-only";

import type { AppResult } from "@/lib/contracts/result";
import { getErrorMessage, resultErr, resultOk } from "@/lib/contracts/result";
import { publicContentItemSchema, type PublicContentItem } from "@/lib/backend/public-content";
import { getSanityClient } from "@/lib/sanity/client";

type RawSanityContentItem = {
  id?: string;
  _type?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  publishedAt?: string;
};

const LIST_QUERY = `*[
  !(_type in ["sanity.imageAsset", "sanity.fileAsset"]) &&
  defined(slug.current) &&
  defined(title)
] | order(coalesce(publishedAt, _updatedAt, _createdAt) desc)[0...$limit]{
  "id": _id,
  "type": _type,
  title,
  "slug": slug.current,
  "excerpt": coalesce(excerpt, summary, description, ""),
  "publishedAt": coalesce(publishedAt, _updatedAt, _createdAt)
}`;

const DETAIL_QUERY = `*[
  !(_type in ["sanity.imageAsset", "sanity.fileAsset"]) &&
  defined(slug.current) &&
  slug.current == $slug
][0]{
  "id": _id,
  "type": _type,
  title,
  "slug": slug.current,
  "excerpt": coalesce(excerpt, summary, description, ""),
  "publishedAt": coalesce(publishedAt, _updatedAt, _createdAt)
}`;

function mapRawItem(item: RawSanityContentItem): PublicContentItem | null {
  const parsed = publicContentItemSchema.safeParse({
    id: item.id ?? "",
    type: item._type ?? "content",
    title: item.title ?? "Untitled",
    slug: item.slug ?? "",
    excerpt: item.excerpt ?? "",
    publishedAt: item.publishedAt ?? new Date().toISOString(),
  });

  if (!parsed.success) {
    return null;
  }

  return parsed.data;
}

export async function listSanityPublicContent(limit = 12): Promise<AppResult<PublicContentItem[]>> {
  const client = getSanityClient();

  if (!client) {
    return resultErr("NOT_CONFIGURED", "Sanity is enabled but not configured");
  }

  try {
    const rawItems = await client.fetch<RawSanityContentItem[]>(LIST_QUERY, {
      limit,
    });

    const items = (rawItems ?? [])
      .map(mapRawItem)
      .filter((item): item is PublicContentItem => item !== null);

    return resultOk(items, "sanity");
  } catch (error) {
    return resultErr(
      "INTERNAL",
      "Failed to fetch public content from Sanity",
      getErrorMessage(error),
    );
  }
}

export async function getSanityPublicContentBySlug(
  slug: string,
): Promise<AppResult<PublicContentItem>> {
  const client = getSanityClient();

  if (!client) {
    return resultErr("NOT_CONFIGURED", "Sanity is enabled but not configured");
  }

  try {
    const rawItem = await client.fetch<RawSanityContentItem | null>(DETAIL_QUERY, {
      slug,
    });

    if (!rawItem) {
      return resultErr("NOT_FOUND", "Content not found");
    }

    const item = mapRawItem(rawItem);

    if (!item) {
      return resultErr("INTERNAL", "Invalid content payload from Sanity");
    }

    return resultOk(item, "sanity");
  } catch (error) {
    return resultErr(
      "INTERNAL",
      "Failed to fetch content detail from Sanity",
      getErrorMessage(error),
    );
  }
}
