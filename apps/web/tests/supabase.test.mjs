import test from "node:test";
import assert from "node:assert/strict";
import { supabaseConfigured, supabaseRequest, ensureProductImageBucket, uploadProductImage } from "../src/lib/server/supabase.ts";

test("Storage usa a chave secreta somente no servidor e não habilita banco com chave pública", async () => {
  const names = ["SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY"];
  const previous = names.map((name) => [name, process.env[name]]), originalFetch = globalThis.fetch;
  try {
    process.env.SUPABASE_URL = ""; process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test-project.supabase.co";
    process.env.SUPABASE_SECRET_KEY = ""; delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    assert.equal(supabaseConfigured(), false);
    process.env.SUPABASE_SECRET_KEY = "sb_secret_test_fixture";
    const requests = [];
    globalThis.fetch = async (url, init) => {
      assert.equal(new URL(url).origin, "https://test-project.supabase.co");
      assert.equal(init.headers.get("apikey"), "sb_secret_test_fixture");
      assert.equal(init.headers.get("authorization"), null);
      assert.equal(init.cache, "no-store"); assert.equal(init.redirect, "error");
      requests.push(url);
      if (url.endsWith("/storage/v1/bucket")) return Response.json([{ id: "essen-product-images", public: true }]);
      assert.equal(init.headers.get("x-upsert"), "false");
      return Response.json({ Key: "test.webp" });
    };
    assert.equal(await uploadProductImage("test.webp", Buffer.from("test"), "image/webp"), "https://test-project.supabase.co/storage/v1/object/public/essen-product-images/test.webp");
    assert.equal(requests.length, 2);
    process.env.SUPABASE_SECRET_KEY = "sb_publishable_not_secret";
    await assert.rejects(supabaseRequest("/storage/v1/bucket"), /nunca uma chave pública/);
  } finally {
    globalThis.fetch = originalFetch;
    for (const [name, value] of previous) { if (value === undefined) delete process.env[name]; else process.env[name] = value; }
  }
});

test("cria o bucket de catálogo ausente sem alterar um bucket privado existente", async () => {
  const names = ["SUPABASE_URL", "SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY"];
  const previous = names.map((name) => [name, process.env[name]]), originalFetch = globalThis.fetch;
  try {
    process.env.SUPABASE_URL = "https://test-project.supabase.co"; process.env.SUPABASE_SECRET_KEY = "sb_secret_test_fixture";
    let created = false;
    globalThis.fetch = async (_url, init) => {
      if (init.method !== "POST") return Response.json([]);
      const bucket = JSON.parse(init.body); assert.equal(bucket.public, true); assert.equal(bucket.file_size_limit, 4194304);
      created = true; return Response.json({ name: bucket.name });
    };
    await ensureProductImageBucket(); assert.equal(created, true);
    globalThis.fetch = async (_url, init) => { assert.notEqual(init.method, "POST"); return Response.json([{ id: "essen-product-images", public: false }]); };
    await assert.rejects(ensureProductImageBucket(), /privado/);
  } finally {
    globalThis.fetch = originalFetch;
    for (const [name, value] of previous) { if (value === undefined) delete process.env[name]; else process.env[name] = value; }
  }
});
