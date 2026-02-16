# {{APP_TITLE}}

This project serves vector tiles from the {{TABLE_NAME}} dataset using FastAPI, DuckDB, and MapLibre GL JS.

## Prerequisites

- Python 3.9+
- [DuckDB CLI](https://duckdb.org/docs/archive/0.9.2/cli) (optional, for manual inspection)

## Getting Started

### 1. Set up a Virtual Environment

It is **required** to run this application within a Python virtual environment.

```bash
# Create the virtual environment
python3 -m venv .venv

# Activate it
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Prepare the Data

Ensure your source data is in the `data/` directory, then run:

```bash
python scripts/prepare_data.py
```

This will create a GeoParquet file and initialize the DuckDB database.

### 4. Run the Application

```bash
fastapi dev backend/main.py
```

The application will be available at `http://127.0.0.1:8000`. The frontend is served automatically at the root.

## Project Structure

- `backend/`: FastAPI application and database logic.
- `frontend/`: MapLibre GL JS frontend (HTML, JS, CSS).
- `data/`: Raw and processed data (DuckDB, GeoParquet).
- `scripts/`: Data preparation and deployment scripts.
- `Dockerfile`: For containerized deployment.
