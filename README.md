# Gemini Skills Collection

This repository contains a collection of custom skills for the [Gemini CLI](https://github.com/google/gemini-cli). These skills extend the agent's capabilities with specialized workflows, tool integrations, and domain-specific knowledge.

## Available Skills

### [Tile Server Builder](./skills/tile-server-builder)
Scaffolds a high-performance vector tile server project using **FastAPI**, **DuckDB**, and **MapLibre GL JS**. It automates data preparation (GeoParquet/RTREE), dynamic MVT serving, and provides optional CI/CD templates for Google Cloud Run.
*(Gemini CLI format)*

### [Deploy to p3](./skills/deploy-to-p3)
Scaffolds GitHub Actions CI/CD deployment for any app to the `*.p3.geoint.mx` experimental server. Generates `docker-compose.prod.yml`, a deploy workflow, and Caddyfile instructions.
*(Claude Code format)*

## Installation

### Claude Code skills

Clone the repo and symlink or copy the skill directory to your personal skills folder:

```bash
git clone <repository-url>

# Personal install (available in all projects)
cp -r plablo-gemini-skills/skills/deploy-to-p3 ~/.claude/skills/

# Or project-level install
cp -r plablo-gemini-skills/skills/deploy-to-p3 .claude/skills/
```

Then invoke with `/deploy-to-p3` in any Claude Code session.

### Gemini CLI skills

```bash
gemini skills install tile-server-builder.skill --scope user
/skills reload
```

### Packaging Gemini CLI skills
If you modify a Gemini skill's source code, repackage before reinstalling:
```bash
node <path-to-skill-creator>/scripts/package_skill.cjs skills/<skill-name>
```
