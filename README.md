# Gemini Skills Collection

This repository contains a collection of custom skills for the [Gemini CLI](https://github.com/google/gemini-cli). These skills extend the agent's capabilities with specialized workflows, tool integrations, and domain-specific knowledge.

## Available Skills

### [Tile Server Builder](./skills/tile-server-builder)
Scaffolds a high-performance vector tile server project using **FastAPI**, **DuckDB**, and **MapLibre GL JS**. It automates data preparation (GeoParquet/RTREE), dynamic MVT serving, and provides optional CI/CD templates for Google Cloud Run.

## Installation

To install a skill from this repository, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd plablo-gemini-skills
    ```

2.  **Install the desired skill:**
    You can install a skill either at the user level (available for all projects) or the workspace level (available only for the current project).

    *   **User Level (Recommended):**
        ```bash
        gemini skills install tile-server-builder.skill --scope user
        ```
    *   **Workspace Level:**
        ```bash
        gemini skills install tile-server-builder.skill --scope workspace
        ```

3.  **Reload Skills:**
    After installation, you **must** reload the skills in your active Gemini CLI session to enable them:
    ```bash
    /skills reload
    ```

## Development & Contribution

Each skill is organized within the `skills/` directory following the standard Gemini CLI skill anatomy.

### Packaging Skills
If you modify a skill's source code, you must repackage it before reinstalling:
```bash
node <path-to-skill-creator>/scripts/package_skill.cjs skills/<skill-name>
```
