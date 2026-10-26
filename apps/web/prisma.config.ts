import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local", quiet: true });
config({ path: ".env", quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // generate/validate work offline. Commands that access the DB require a real URL.
  datasource: { url: process.env.DIRECT_URL || process.env.DATABASE_URL || "" },
});
