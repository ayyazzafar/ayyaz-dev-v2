import { defineConfig } from "orval";

export default defineConfig({
  // React Query hooks generation
  // Note: Zod schemas are now imported from @ayyaz-dev/api-client
  api: {
    input: {
      target: "http://localhost:4000/docs-json",
    },
    output: {
      mode: "tags-split",
      target: "./lib/api/generated",
      schemas: "./lib/api/schemas",
      client: "react-query",
      clean: true,
      override: {
        mutator: {
          path: "./lib/api/axios-instance.ts",
          name: "customInstance",
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
});
