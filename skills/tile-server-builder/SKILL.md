---
name: tile-server-builder
description: Scaffolds a new project for serving vector tiles from geospatial data using FastAPI, DuckDB, and MapLibre GL JS.
---

# Tile Server Builder

This skill scaffolds a new project for serving vector tiles from geospatial data using FastAPI, DuckDB, and MapLibre GL JS.

## Requirements

*   **Virtual Environment:** The generated project MUST be developed and run within a Python virtual environment (`.venv`). This ensures dependency isolation and consistent behavior across environments.

## Workflow

1.  **Invocation:** Invoke the `tile-server-builder` skill with a project name.
2.  **Information Gathering (CRITICAL):** Before generating any files, you MUST gather information about the user's dataset. 
    *   Ask for the path to the input data file (e.g., shapefile, GeoJSON).
    *   Inspect the data (if accessible) or ask the user for:
        *   Primary table name and MVT layer name.
        *   Key columns for visualization (e.g., category for coloring, numeric field for 3D extrusion).
        *   Geographic extent or preferred initial map center and zoom level.
    *   **Deployment (OPTIONAL):** Ask the user if they want to configure automated deployment to Google Cloud Run. If yes, gather:
        *   GCP Project ID, GCS Bucket, Region, etc.
3.  **Project Scaffolding:** Create the project directory and generate files by replacing placeholders in templates with the gathered information.
4.  **Core File Generation:** The skill generates the following files:
    *   **Backend:** `backend/main.py`, `backend/db.py`, `requirements.txt`
    *   **Frontend:** `frontend/index.html`, `frontend/map.js`, `frontend/style.css`
    *   **Data Preparation:** `prepare_data.py`
    *   **Other:** `README.md`, `.gitignore`, `Dockerfile`
    *   **Deployment (Only if requested):** `.github/workflows/ci-cd.yml`, `scripts/deploy_data.sh`
5.  **Customization and Development:** Customize the generated files to your specific needs.
    *   Update `prepare_data.py` to use your own data source.
    *   Modify the SQL query in `backend/main.py` to customize the tile generation.
    *   Adjust the map style in `frontend/map.js`.
5.  **Data Preparation:** Run `prepare_data.py` to create the initial DuckDB database.
6.  **Local Development:**
    *   Create a Python virtual environment: `python3 -m venv .venv`
    *   Activate the virtual environment: `source .venv/bin/activate` (or `.venv\Scripts\activate` on Windows).
    *   Install dependencies: `pip install -r requirements.txt`
    *   Run the FastAPI backend: `fastapi dev backend/main.py`
    *   View the map locally.
7.  **Deployment:** Use `scripts/deploy_data.sh` and push to `main` to trigger the CI/CD pipeline.

## Placeholder Reference

When generating files from assets, replace these placeholders with user-specific values:

| Placeholder | Description |
| :--- | :--- |
| `{{APP_TITLE}}` | Human-readable title of the map application. |
| `{{DB_NAME}}` | Filename for the DuckDB database (without extension). |
| `{{TABLE_NAME}}` | SQL table name in DuckDB. |
| `{{GEOPARQUET_NAME}}` | Filename for the intermediate GeoParquet file. |
| `{{LAYER_NAME}}` | Name of the layer inside the MVT tile. |
| `{{MIN_ZOOM}}` / `{{MAX_ZOOM}}` | Zoom range for tile serving and map display. |
| `{{COLUMNS_SELECTION}}` | SQL column selection for `ST_AsMVT` (e.g., `t.id, t.type`). |
| `{{COLUMNS_LIST}}` | Comma-separated list of columns in the final MVT subquery. |
| `{{SOURCE_ID}}` | MapLibre source identifier (short string). |
| `{{COLOR_EXPRESSION}}` | MapLibre GL JS color expression (e.g., `['match', ['get', 'type'], ... ]`). |
| `{{EXTRUSION_HEIGHT_EXPRESSION}}` | MapLibre expression for 3D height. |
| `{{MAP_CENTER}}` | Initial center `[lng, lat]`. |
| `{{INITIAL_ZOOM}}` | Initial map zoom level. |
| `{{LEGEND_TITLE}}` | Title for the map legend. |
| `{{LEGEND_ITEMS}}` | HTML strings for legend entries. |
| `{{INPUT_FILE}}` | Path to the source data file within the `data/` directory. |
| `{{GCS_BUCKET}}` | Google Cloud Storage bucket name. |
| `{{GCP_PROJECT_ID}}` | GCP Project ID for deployment. |
| `{{GCP_REGION}}` | GCP Region (e.g., `us-central1`). |
| `{{GCP_ARTIFACT_REPO}}` | Artifact Registry repository name. |
| `{{IMAGE_NAME}}` / `{{SERVICE_NAME}}` | Container image and Cloud Run service names. |

## Bundled Resources

This skill includes the following assets and scripts:

### Assets

*   `assets/backend/`: FastAPI backend templates.
*   `assets/frontend/`: MapLibre GL JS frontend templates.
*   `assets/data/`: An empty directory for your data.
*   `assets/deployment/`: Dockerfile, CI/CD workflow, and deployment script templates.
*   `assets/project/`: `.gitignore` and `README.md` templates.

### Scripts

*   `scripts/prepare_data.py`: A template for data ingestion, cleaning, reprojection, and conversion to GeoParquet.
*   `scripts/deploy_data.sh`: A template for uploading the DuckDB file to GCS.
