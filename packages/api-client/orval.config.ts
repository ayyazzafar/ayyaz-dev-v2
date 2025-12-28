import { defineConfig } from "orval";

export default defineConfig({
  // TypeScript schemas (types only, no client)
  schemas: {
    input: {
      target: "http://localhost:4000/docs-json",
    },
    output: {
      mode: "tags-split",
      target: "./src/schemas",
      schemas: "./src/schemas",
      client: "fetch", // Using fetch to generate schemas, we won't use the client
      clean: true,
      override: {
        // Don't generate any actual client code, just types
        fetch: {
          includeHttpResponseReturnType: false,
        },
      },
    },
  },
  // Zod schemas generation
  zod: {
    input: {
      target: "http://localhost:4000/docs-json",
    },
    output: {
      mode: "single",
      target: "./src/zod.ts",
      client: "zod",
    },
  },
});
