# Psitools

Psitools is a Next.js application within the Project Name monorepo. This README provides information specific to the Psitools application.

## Table of Contents

- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

- Node.js >= 20.18.1
- PNPM >= 9.15.1

### Installation

1. Navigate to the Psitools directory:

   ```sh
   cd apps/psitools
   ```

1. Install dependencies from root folder:

   ```sh
   pnpm install
   ```

1. Set up environment variables:

   Copy the `.env.example` file to `.env` and fill in the required values.

   ```sh
   cp .env.example .env
   ```

### Running the Application

To start the development server, run:

```sh
pnpm dev
```

## Scripts

The following scripts are available in the `package.json` of the Psitools application:

- `build`: Build the Next.js app.
- `db:migrate`: Run Prisma migrations.
- `db:studio`: Open Prisma Studio.
- `dev`: Start the Next.js development server.
- `lint`: Run ESLint.

## Environment Variables

The Psitools application uses environment variables for configuration. The following variables are required:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `AUTH_SECRET`
- `AUTH_JWT_SECRET`
- `NEXT_PUBLIC_KEYCLOAK_CLIENT_ID`
- `CLIENT_SECRET`
- `NEXT_PUBLIC_KEYCLOAK_REALM`
- `NEXT_PUBLIC_AUTH_URL`
- `SECRET`
- `KEYCLOAK_VERSION`
- `PORT_KEYCLOAK`
- `BOTPRESS_DB`
- `POSTGRESQL_PASS`
- `POSTGRESQL_DB`
- `PROXY_ADDRESS_FORWARDING`
- `NEXT_PUBLIC_KEYCLOAK_FRONTEND_URL`
- `KC_PROXY`
- `WAZUH_RSYSLOG`
- `SYSLOG_PORT`
- `SYSLOG_PROTOCOL`
- `OUTSIDEPORT`
- `REMOTELOGGER`
- `NEXT_PUBLIC_TRPC_LOGGER_ENABLED`
- `PRODUCTION_URL`
- `EXPO_PUBLIC_KEYCLOAK_URL`
- `EXPO_PUBLIC_KEYCLOAK_CLIENT_ID`
- `EXPO_PUBLIC_CONEY_BASE_URL`
- `EXPO_PUBLIC_CONEY_USER`
- `EXPO_PUBLIC_CONEY_PASS`
- `EXPO_PUBLIC_KEYCLOAK_CLIENT_SECRET`
- `EXPO_PUBLIC_APPWRITE_API_ENDPOINT`
- `EXPO_PUBLIC_APPWRITE_PROJECT_ID`
- `NEXT_PUBLIC_APP_URL`
- `COOKIE_SECRET`
- `EXPO_PUBLIC_KEYCLOAK_REALM`
- `EXPO_OS`

## Contributing

We welcome contributions! Please follow the guidelines below:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
