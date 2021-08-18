import { fromRollup } from '@web/dev-server-rollup';
import rollupCommonjs from '@rollup/plugin-commonjs';
import proxy from 'koa-proxies';

const commonjs = fromRollup(rollupCommonjs);

export default {
  mimeTypes: {
    '**/*.cjs': 'js'
  },
  port: 9010,
  middleware: [
    proxy('/api/', {
      target: 'http://localhost:4242/',
    }),
  ],
  plugins: [
    commonjs({
      include: [
        'node_modules/linkifyjs/**/*',
        'node_modules/moment/**/*',
        '**/*/node_modules/linkifyjs/**/*',
        '**/*/node_modules/i18next-http-backend/**/*'
      ],
    }),
  ],
};
