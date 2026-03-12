import { defineConfig } from 'orval';

export default defineConfig({
  tripvault: {
    input: 'http://localhost:3000/api/docs-json',
    output: {
      target: './src/api/index.ts',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/api/axios.ts',
          name: 'axiosInstance',
        },
      },
    },
  },
});
