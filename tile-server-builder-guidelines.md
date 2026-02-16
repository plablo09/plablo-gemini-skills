# Tile Server Builder Skill: Workflow, Principles, and Guidelines

This document outlines the core workflow, underlying principles, and essential guidelines for utilizing the `tile-server-builder` Gemini CLI skill. This skill is designed to rapidly scaffold new projects that leverage FastAPI, DuckDB, and MapLibre GL JS to serve performant vector tiles from geospatial data.

## 1. Core Principles of the Tile Serving Scheme

These principles drive the design and functionality of the generated projects:

### 1.1 Dynamic Tile Generation
*   **On-the-fly serving:** Tiles are generated in real-time upon request, rather than being pre-rendered.
*   **Flexibility:** Easily update data by replacing the source file; changes are immediately reflected.
*   **Efficiency:** Minimal storage required, only source data is stored.
*   **Extensibility:** Enables advanced features like server-side filtering and thematic styling.

### 1.2 DuckDB for Geospatial Data
*   **Embedded and Performant:** DuckDB acts as a fast, embedded analytical database.
*   **Spatial Extension:** Leverages DuckDB's spatial capabilities for querying and MVT generation.
*   **File-Backed Database:** Essential for connection pooling and sharing data across concurrent connections.

### 1.3 Optimized Data Preparation
*   **Pre-projection:** Source data is pre-projected to EPSG:3857 (Web Mercator) to avoid on-the-fly coordinate transformations within tile queries, boosting performance.
*   **GeoParquet Format:** Utilizes GeoParquet as an efficient, columnar storage format for geospatial vector data.
*   **Spatial Indexing:** Implementation of `RTREE` indexes in DuckDB for accelerated spatial queries.

### 1.4 Robust Backend (FastAPI)
*   **Asynchronous:** FastAPI's `async`/`await` support allows efficient handling of concurrent tile requests.
*   **Connection Pooling:** Manages DuckDB connections to prevent "random tile failures" and ensure stability under load. Each connection loads the spatial extension explicitly.
*   **Failure Philosophy:** "Fail fast" at startup for database and spatial extension checks to ensure a healthy server.

### 1.5 Frontend Visualization (MapLibre GL JS)
*   **Lightweight Viewer:** Simple, vanilla HTML/CSS/JS frontend for focused visualization.
*   **Cache Management:** Implementation of `Cache-Control` headers and client-side `TILE_VERSION` parameter to bust browser caches upon schema changes.

### 1.6 Cloud-Native Deployment (Docker, Cloud Run, GCS)
*   **Containerized:** Projects are Dockerized for consistent deployment environments.
*   **Cloud Run:** Designed for serverless deployment on Google Cloud Run.
*   **Remote Artifact Pattern:** Large DuckDB files are stored in Google Cloud Storage (GCS) and baked into the Docker image during CD.

## 2. Skill Workflow: Using the `tile-server-builder` Skill

This section describes the typical steps a user will follow when invoking the skill.

1.  **Invocation:** User invokes the `tile-server-builder` skill with a project name.
2.  **Project Scaffolding:** The skill creates a new project directory with a predefined structure.
3.  **Core File Generation:** Basic backend (FastAPI, `db.py`, `main.py`), frontend (`index.html`, `map.js`, `style.css`), `Dockerfile`, `requirements.txt`, and `.gitignore` files are generated as templates.
4.  **Data Preparation Script (`prepare_data.py`):** A template for data ingestion, cleaning, reprojection to EPSG:3857, and conversion to GeoParquet/DuckDB.
5.  **Deployment Script (`deploy_data.sh`):** A template for uploading the DuckDB file to GCS.
6.  **CI/CD Workflow (`.github/workflows/ci-cd.yml`):** A template for GitHub Actions to automate testing (with synthetic data) and deployment to Google Cloud Run.
7.  **Customization and Development:** User customizes the generated files (e.g., specific SQL queries for tiles, styling, data sources).
8.  **Data Preparation:** User runs `prepare_data.py` to create the initial DuckDB file.
9.  **Local Development:** User runs the FastAPI backend and views the map locally.
10. **Deployment:** User uses `deploy_data.sh` and pushes to `main` to trigger the CI/CD pipeline.

## 3. Guidelines for Generated Projects

These guidelines ensure consistency and best practices in projects created using this skill:

*   **Python (Backend):** Use 4-space indentation, `snake_case` for variables/functions, `UPPER_SNAKE_CASE` for constants.
*   **JavaScript (Frontend):** Use 4-space indentation, `lowerCamelCase` for variables/functions.
*   **Commit Messages:** Adhere to Conventional Commits (e.g., `feat(backend):`, `chore(ci):`).
*   **Schema Changes:** Remember to bump the `TILE_VERSION` in `frontend/map.js` whenever the backend MVT schema changes to bust browser caches.
*   **Data Updates:** Follow the "Remote Artifact" pattern: update locally, `deploy_data.sh` to GCS, then push code changes to `main`.
*   **Testing:** Utilize `pytest` for backend API logic. Ensure dummy data generation for CI.
*   **Error Handling:** Implement robust error handling, especially for DuckDB and spatial operations.
