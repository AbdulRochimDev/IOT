# Deploying the Logistics IoT Web App to Vercel

This guide walks through deploying the Next.js application located in `LogistikIOT` to [Vercel](https://vercel.com/).

## Prerequisites

- A Vercel account with the Vercel CLI installed locally (`npm i -g vercel`).
- Access to the repository that contains the Logistics IoT project.
- A MySQL-compatible database (PlanetScale, Neon + MySQL, etc.) with a connection string ready. The application uses Prisma, so the `DATABASE_URL` must be reachable from Vercel.
- (Optional) A Vercel project already created. If you do not have one, the CLI will let you create it during `vercel link`.
- The repository ships with a `vercel.json` file in the project root that pins Node.js 20 and runs installs/builds with `pnpm`. Keep this file at the root when you import the project into Vercel so the deployment uses the correct settings.

## 1. Set the project root

The Next.js application lives under `LogistikIOT`. When you deploy to Vercel you must set the **Root Directory** to this folder. You can do it through the Vercel dashboard or the CLI:

```bash
cd LogistikIOT
vercel link
```

Accept the prompt to set the current directory as the project root.

## 2. Configure environment variables

Create the required environment variables in Vercel. At minimum define:

- `DATABASE_URL` – the Prisma-compatible MySQL connection string. For TiDB Cloud projects this follows the format
  `mysql://<tidb-user>.root:<password>@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/<database>?sslaccept=strict`
  (replace with the values from your TiDB cluster). Note that the user name *includes* the `.root` suffix—copy the full string.

You can set variables from the CLI:

```bash
vercel env add DATABASE_URL production
vercel env add DATABASE_URL preview
```

Paste the database URL when prompted. Repeat for any other secrets you add later. After adding the value, run `vercel env pull`
locally to confirm the variable is set for the environment you need (Preview/Production). If you only set the secret for one
environment the deployment for the other will fail to connect to the database.

## 3. Ensure the schema is migrated

Before deploying, make sure your database has the latest schema:

```bash
cd LogistikIOT
pnpm install
pnpm prisma migrate deploy
```

Running migrations locally before the first deploy ensures Prisma has created all tables for the production database. For future deploys you can continue to use `prisma migrate deploy` in your CI/CD workflow.

## 4. Deploy with the Vercel CLI

From the `LogistikIOT` directory run:

```bash
vercel --prod
```

The command will build the project using the configuration in `vercel.json`, upload the build output, and point the production domain to the new deployment. For preview deployments omit `--prod`.

If the build fails because dependencies are missing, double-check that the `pnpm-lock.yaml` file is committed and that your project is configured to use **Node.js 20** (matching the `vercel.json` file in the project root).

## 5. Post-deployment checklist

- Visit the deployment URL shown in the CLI output to verify the site loads.
- Test key flows (inventory, inbound/outbound, scanning) to ensure the API routes work with your production database.
- Configure monitoring/alerts for your database as needed.

## Troubleshooting

- **Build fails with missing Prisma Client** – Vercel runs `pnpm install` followed by `pnpm run build`. Make sure `postinstall` runs `prisma generate` (already configured in `package.json`).
- **Database connection errors** – Confirm the database allows connections from Vercel. For managed databases you may need to enable public access or create a Vercel-specific password/user.
- **Environment variables not available at build time** – Ensure the variables are defined for both *Preview* and *Production* environments in Vercel if you plan to use both.

With these steps the Logistics IoT web application should deploy successfully on Vercel.
