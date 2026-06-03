/**
 * @module cms.config
 *
 * NextOS CMS configuration — declares every resource that should
 * appear in the admin dashboard, mapping URL slugs to Postgres tables
 * and to renderable form fields. See @connormccarl/nextos types.ts
 * (`defineCmsConfig`, `ResourceDef`, `FieldDef`) for the shape.
 */

import { defineCmsConfig } from "@connormccarl/nextos";

export const cms = defineCmsConfig({
  siteName: "First Lutheran Miami",
  resources: [
    {
      slug: "events",
      label: "Events",
      singular: "Event",
      collection: "events",
      icon: "calendar",
      fields: [
        { key: "title", label: "Title", type: "text", required: true },
        { key: "description", label: "Description", type: "textarea" },
        { key: "date", label: "Date", type: "date", required: true },
        { key: "time", label: "Time", type: "time" },
        { key: "location", label: "Location", type: "text" },
        {
          key: "type",
          label: "Type",
          type: "select",
          options: ["worship", "study", "social", "celebration", "meeting", "music"],
        },
        { key: "pastor", label: "Pastor / Lead", type: "text" },
        { key: "image", label: "Image URL", type: "url" },
      ],
      tableColumns: ["title", "date", "time", "type"],
    },
    {
      slug: "gallery",
      label: "Gallery",
      singular: "Photo",
      collection: "gallery",
      icon: "image",
      fields: [
        { key: "title", label: "Title", type: "text", required: true },
        { key: "image_url", label: "Image URL", type: "url", required: true },
        { key: "caption", label: "Caption", type: "textarea" },
        { key: "category", label: "Category", type: "text" },
      ],
      tableColumns: ["title", "category", "image_url"],
    },
    {
      slug: "media",
      label: "Media",
      singular: "Media item",
      collection: "media",
      icon: "film",
      fields: [
        { key: "title", label: "Title", type: "text", required: true },
        {
          key: "type",
          label: "Type",
          type: "select",
          options: ["video", "audio", "photo", "article"],
        },
        { key: "speaker", label: "Speaker", type: "text" },
        { key: "scripture", label: "Scripture", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "file_url", label: "Media URL", type: "url" },
        { key: "thumbnail_url", label: "Thumbnail URL", type: "url" },
        { key: "duration", label: "Duration", type: "text" },
      ],
      tableColumns: ["title", "type", "speaker"],
    },
    {
      slug: "site-content",
      label: "Site Content",
      singular: "Content block",
      collection: "site_content",
      icon: "text",
      fields: [
        { key: "key", label: "Key", type: "text", required: true, helpText: "e.g. home.hero.headline" },
        { key: "value", label: "Value", type: "richtext", required: true },
        { key: "page", label: "Page", type: "text" },
        { key: "notes", label: "Notes", type: "textarea" },
      ],
      tableColumns: ["key", "page", "value"],
    },
    {
      slug: "registrations",
      label: "Registrations",
      singular: "Registration",
      collection: "event_registrations",
      icon: "users",
      readOnly: true,
      fields: [
        { key: "event_title", label: "Event", type: "text" },
        { key: "name", label: "Name", type: "text" },
        { key: "email", label: "Email", type: "email" },
        { key: "phone", label: "Phone", type: "text" },
        { key: "status", label: "Status", type: "text" },
      ],
      tableColumns: ["event_title", "name", "email", "status"],
    },
    {
      slug: "contact",
      label: "Contact Submissions",
      singular: "Submission",
      collection: "contact_forms",
      icon: "mail",
      readOnly: true,
      fields: [
        { key: "name", label: "Name", type: "text" },
        { key: "email", label: "Email", type: "email" },
        { key: "subject", label: "Subject", type: "text" },
        { key: "message", label: "Message", type: "textarea" },
        { key: "phone", label: "Phone", type: "text" },
      ],
      tableColumns: ["name", "email", "subject"],
    },
    {
      slug: "donations",
      label: "Donations",
      singular: "Donation",
      collection: "donations",
      icon: "heart",
      readOnly: true,
      fields: [
        { key: "amount", label: "Amount", type: "number" },
        { key: "donor_name", label: "Donor name", type: "text" },
        { key: "donor_email", label: "Donor email", type: "email" },
        { key: "payment_method", label: "Method", type: "text" },
        { key: "status", label: "Status", type: "text" },
        { key: "message", label: "Message", type: "textarea" },
      ],
      tableColumns: ["donor_name", "amount", "status", "payment_method"],
    },
  ],
});
