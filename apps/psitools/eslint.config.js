import baseConfig, { restrictEnvAccess } from '@arianne/eslint-config/base';
import nextjsConfig from '@arianne/eslint-config/nextjs';
import reactConfig from '@arianne/eslint-config/react';

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['.next/**', 'keycloak'],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
