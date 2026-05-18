# @flc/cms

Lightweight, opinionated CMS toolkit for **Next.js App Router + MongoDB** applications.

Built originally for [First Lutheran Church of Miami](https://miami-lutheran-app.preview.emergentagent.com), but generic enough to drop into any Next.js project that uses MongoDB.

## Features

- 🗂️ **Define-once schema** — describe your resources once, get CRUD UI + API for free
- 🔐 **Password gate** — stateless HMAC-signed cookie, single shared password via `ADMIN_PASSWORD`
- 🖼️ **Distinct dashboard UI** — sidebar nav, table view, modal create/edit form
- 📦 **Tree-shakable** — separate client (`@flc/cms`) and server (`@flc/cms/server`) entrypoints
- 🧪 **Zero-runtime-deps tests** — uses the Node.js built-in test runner

## Install

```bash
npm install @flc/cms
# peers (already in your Next.js project):
npm install next react react-dom mongodb lucide-react
```

## Usage

### 1. Define your resources

```ts
// app/cms.config.ts
import { defineCmsConfig } from "@flc/cms";

export const cms = defineCmsConfig({
  siteName: "Your Site",
  resources: [
    {
      slug: "events",
      label: "Events",
      singular: "Event",
      collection: "events",
      icon: "calendar",
      fields: [
        { key: "title",       label: "Title",       type: "text",     required: true },
        { key: "description", label: "Description", type: "textarea" },
        { key: "date",        label: "Date",        type: "date",     required: true },
        { key: "time",        label: "Time",        type: "time" },
        { key: "location",    label: "Location",    type: "text" },
        {
          key: "type", label: "Type", type: "select",
          options: ["worship", "study", "social", "celebration"],
        },
      ],
      tableColumns: ["title", "date", "time", "type"],
    },
    {
      slug: "donations",
      label: "Donations",
      singular: "Donation",
      collection: "donations",
      icon: "heart",
      readOnly: true,
      fields: [
        { key: "amount",      label: "Amount",      type: "number" },
        { key: "donor_name",  label: "Donor Name",  type: "text" },
        { key: "donor_email", label: "Donor Email", type: "email" },
        { key: "status",      label: "Status",      type: "text" },
      ],
    },
  ],
});
```

### 2. Wire the API routes

```ts
// app/api/admin/[...slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyAdminCookie,
  listRecords, createRecord, updateRecord, deleteRecord,
} from "@flc/cms/server";
import { cms } from "@/app/cms.config";
import { getDb } from "@/lib/mongo";

const deps = { config: cms, getDb };

async function requireAuth() {
  const c = (await cookies()).get("flc_cms_admin")?.value;
  return verifyAdminCookie(c);
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  if (!(await requireAuth())) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  return NextResponse.json(await listRecords(deps, slug[0]));
}

// POST / PUT / DELETE follow the same pattern …
```

### 3. Render the UI

```tsx
// app/admin/events/page.tsx
"use client";
import { ResourcePage } from "@flc/cms";
import { cms } from "@/app/cms.config";

export default function Page() {
  const events = cms.resources.find((r) => r.slug === "events")!;
  return <ResourcePage resource={events} />;
}
```

### 4. Set the password

```bash
# .env
ADMIN_PASSWORD=changeme-please
CMS_SECRET=any-long-random-string
```

## API surface

```ts
// Client (@flc/cms)
defineCmsConfig(cfg)
<AdminShell config active onLogout extraNav>...</AdminShell>
<Sidebar config active onLogout extraNav />
<PasswordGate loginEndpoint onSuccess title subtitle />
<DataTable resource records onEdit onDelete />
<RecordForm resource initial onClose onSubmit />
<ResourcePage resource endpoint />

// Server (@flc/cms/server)
signAdminCookie() / clearAdminCookie() / verifyAdminCookie(value)
checkAdminPassword(provided)
listRecords(deps, slug, opts)
createRecord(deps, slug, data)
updateRecord(deps, slug, id, data)
deleteRecord(deps, slug, id)
```

## Develop

```bash
yarn install
yarn build       # tsup → dist/
yarn test        # Node built-in test runner
yarn typecheck
```

## License

MIT
