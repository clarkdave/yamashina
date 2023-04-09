#!/bin/bash -ex

# shellcheck source=/dev/null
source .env

pnpm run clean
pnpm parcel build manifest.json --target webext-prod

web-ext lint \
  --source-dir ./dist/webext-prod

web-ext build \
  --source-dir ./dist/webext-prod

web-ext sign \
  --source-dir ./dist/webext-prod \
  --api-key="$WEB_EXT_API_KEY" \
  --api-secret="$WEB_EXT_API_SECRET"
  # --use-submission-api \
  # --channel=unlisted \
