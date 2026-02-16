#!/bin/bash
set -e

BUCKET_NAME="{{GCS_BUCKET}}"
DB_FILE="data/{{DB_NAME}}.duckdb"
GCS_PATH="gs://${BUCKET_NAME}/{{DB_NAME}}.duckdb"

if [ ! -f "$DB_FILE" ]; then
    echo "Error: Database file '$DB_FILE' not found."
    exit 1
fi

echo "Uploading '$DB_FILE' to '$GCS_PATH'..."
gcloud storage cp "$DB_FILE" "$GCS_PATH"

echo "Upload complete."
echo "To deploy the changes, verify the CI/CD workflow passes and merge to main."
