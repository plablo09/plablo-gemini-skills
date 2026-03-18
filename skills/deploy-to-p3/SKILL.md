---
name: deploy-to-p3
description: Scaffolds GitHub Actions CI/CD deployment for any app to the p3.geoint.mx experimental server. Generates docker-compose.prod.yml, a deploy workflow, and Caddyfile instructions.
disable-model-invocation: true
argument-hint: [app-name]
allowed-tools: Read, Write, Edit
---

# Deploy to p3

This skill wires up automated deployment for any app to the self-hosted experimental server at `*.p3.geoint.mx`.

## Server Architecture

- **Reverse proxy:** Caddy, config at `deployment/server_config/Caddyfile`
- **Container registry:** GitHub Container Registry (`ghcr.io/<owner>/<repo>:<sha>`)
- **Networking:** Shared Docker network named `gateway`; all containers join it and Caddy routes by container name
- **Runner:** Self-hosted GitHub Actions runner (reachable via Tailscale)
- **Apps path:** `/home/deploy/apps/<app-name>` on host `experimentos`
- **Domain:** `*.p3.geoint.mx`

## Asset Templates

This skill includes templates in `${CLAUDE_SKILL_DIR}/assets/`:

- `${CLAUDE_SKILL_DIR}/assets/docker-compose.prod.yml` — Production Docker Compose template
- `${CLAUDE_SKILL_DIR}/assets/deploy.yml` — GitHub Actions deploy workflow template
- `${CLAUDE_SKILL_DIR}/assets/caddyfile-block.txt` — Caddyfile reverse proxy block template

## Workflow

1. **Invocation:** User invokes `/deploy-to-p3` in a project directory.

2. **Information Gathering:** Ask the user for:
   - **App name** (e.g. `spotmet`) — used as the subdomain and container name prefix. Use `$ARGUMENTS` if provided.
   - **Internal port** the app listens on inside the container (e.g. `8000`).
   - **GitHub owner/repo** (e.g. `plablo/spotmet`) — used to construct the `ghcr.io` image path.
   - **Does the project already have a `Dockerfile`?** If not, warn the user they must add one before deployment will work.
   - **Does the project already have a CI workflow?** If yes, the deploy workflow should use `workflow_run` trigger after CI succeeds; if no CI exists, deploy triggers directly on push to `main`.
   - **Any environment variables** the app needs at runtime (names only — values go in GitHub Secrets).

3. **File Generation:** Read the templates from `${CLAUDE_SKILL_DIR}/assets/`, replace all placeholders, and write:
   - `docker-compose.prod.yml` in the project root
   - `.github/workflows/deploy.yml` in the project

4. **Caddyfile Block:** Print the filled-in Caddyfile block to the conversation — do NOT write it to disk (it lives on the server).

5. **Post-generation Checklist:** After generating files, tell the user:
   - Add any secret env vars to GitHub repository secrets.
   - SSH into `experimentos` as `deploy` and run `mkdir -p ~/apps/{{APP_NAME}}`.
   - If this is the very first app ever: `docker network create gateway` (only needed once on the server).
   - Append the Caddyfile block to `/home/deploy/apps/server_config/Caddyfile` on `experimentos` and reload: `docker exec caddy caddy reload --config /etc/caddy/Caddyfile`.
   - Push to `main` to trigger the first deploy.

## Placeholder Reference

| Placeholder | Description |
| :--- | :--- |
| `{{APP_NAME}}` | Short app name, used as subdomain and container name prefix (e.g. `spotmet`). |
| `{{PORT}}` | Port the container listens on internally. |
| `{{GITHUB_OWNER_REPO}}` | GitHub `owner/repo` slug (e.g. `plablo/spotmet`). |
| `{{ENV_VARS_BLOCK}}` | `environment:` section in docker-compose for each required env var (empty string if none). |
| `{{DEPLOY_TRIGGER}}` | The full `on:` trigger block — either `workflow_run` after CI or `push` to main. |
