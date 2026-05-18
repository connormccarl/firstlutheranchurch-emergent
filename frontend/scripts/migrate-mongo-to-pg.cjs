#!/usr/bin/env node
/**
 * One-time data migration: MongoDB -> PostgreSQL.
 * Reads from local Mongo (`first_lutheran_miami`) and inserts into PG.
 * Idempotent: skips rows whose id already exists.
 */
const { MongoClient } = require("mongodb");
const { Client } = require("pg");

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
const MONGO_DB = process.env.DB_NAME || "first_lutheran_miami";
const PG_URL =
  process.env.DATABASE_URL ||
  "postgresql://firstlutheranchurch:xRkokVfKiAKW@74.208.24.75:1691/firstlutheranchurch";

// columns to migrate per collection — keys must match PG table columns
const TABLES = {
  events: ["id","title","description","date","time","location","type","pastor","image","created_at","updated_at"],
  event_registrations: ["id","event_title","name","email","phone","notes","status","created_at"],
  contact_forms: ["id","name","email","phone","subject","message","status","created_at"],
  donations: ["id","amount","donor_name","donor_email","message","payment_method","status","paypal_order_id","transaction_id","created_at","completed_at","updated_at"],
  gallery: ["id","title","image_url","caption","category","created_at","updated_at"],
  media: ["id","title","type","speaker","scripture","description","file_url","thumbnail_url","duration","date","created_at","updated_at"],
  site_content: ["id","key","value","page","notes","created_at","updated_at"],
};

function toIso(v) {
  if (v == null) return null;
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "string") return v;
  return String(v);
}

async function main() {
  const mongo = new MongoClient(MONGO_URL);
  await mongo.connect();
  const db = mongo.db(MONGO_DB);

  const pg = new Client({ connectionString: PG_URL });
  await pg.connect();

  for (const [table, cols] of Object.entries(TABLES)) {
    const docs = await db.collection(table).find({}, { projection: { _id: 0 } }).toArray();
    if (!docs.length) {
      console.log(`${table}: nothing to migrate`);
      continue;
    }

    const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
    const sql = `
      INSERT INTO ${table} (${cols.join(", ")})
      VALUES (${placeholders})
      ON CONFLICT (id) DO NOTHING
    `;

    let inserted = 0;
    let skipped = 0;
    for (const doc of docs) {
      const values = cols.map((c) =>
        c === "created_at" || c === "updated_at" || c === "completed_at"
          ? toIso(doc[c])
          : doc[c] ?? null,
      );
      try {
        const res = await pg.query(sql, values);
        if (res.rowCount > 0) inserted++;
        else skipped++;
      } catch (e) {
        console.error(`  failed row ${doc.id || "?"} in ${table}: ${e.message}`);
      }
    }
    console.log(`${table}: ${inserted} inserted, ${skipped} skipped (already in PG)`);
  }

  await mongo.close();
  await pg.end();
  console.log("\nMigration complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
