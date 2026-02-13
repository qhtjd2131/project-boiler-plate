import { defineArrayMember, defineField, defineType } from "sanity";

const publicArticle = defineType({
  name: "publicArticle",
  title: "Public Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(2).max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "seo_title",
      title: "SEO Title",
      type: "string",
    }),
    defineField({
      name: "seo_description",
      title: "SEO Description",
      type: "text",
      rows: 3,
    }),
  ],
});

export const studioSchemaTypes = [publicArticle];
