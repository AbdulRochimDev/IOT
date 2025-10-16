#!/usr/bin/env node
// Ensures Next.js dev server runs without attempting to fetch version info.
if (!process.env.NEXT_DISABLE_VERSION_CHECK) {
  process.env.NEXT_DISABLE_VERSION_CHECK = '1';
}
if (!process.env.NEXT_TELEMETRY_DISABLED) {
  process.env.NEXT_TELEMETRY_DISABLED = '1';
}
// Preserve user-supplied CLI arguments while making sure `dev` is present.
const args = process.argv.slice(2);
if (!args.includes('dev')) {
  process.argv.splice(2, 0, 'dev');
}
require('next/dist/bin/next');
