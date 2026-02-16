import geopandas as gpd
from shapely import make_valid
import os

# Define the input and output file paths relative to the script location
DATA_DIR = "{{DATA_DIR}}"
INPUT_FILE = "{{INPUT_FILE}}" # Can be a shapefile, geojson, etc.
OUTPUT_PARQUET_FILE = "{{GEOPARQUET_NAME}}.geoparquet"

# Construct full paths
input_path = os.path.join(DATA_DIR, INPUT_FILE)
output_parquet_path = os.path.join(DATA_DIR, OUTPUT_PARQUET_FILE)

print(f"Reading data from: {input_path}")

try:
    # Read the data
    gdf = gpd.read_file(input_path)

    print(f"Successfully read {len(gdf)} features.")
    print("Columns found:", gdf.columns.tolist())
    print("CRS:", gdf.crs)

    # Fix invalid geometries once before writing output
    gdf["geometry"] = gdf["geometry"].apply(
        lambda geom: make_valid(geom) if geom is not None and not geom.is_valid else geom
    )

    # Reproject to Web Mercator for tile serving
    gdf = gdf.to_crs("EPSG:3857")
    # Reprojection can introduce minor topology issues; repair again
    gdf["geometry"] = gdf["geometry"].apply(
        lambda geom: make_valid(geom) if geom is not None and not geom.is_valid else geom
    )

    # --- Custom Preprocessing ---
    # {{CUSTOM_PREPROCESSING_LOGIC}}
    # ----------------------------

    # Write the GeoDataFrame to a GeoParquet file
    print(f"Writing data to: {output_parquet_path}")
    gdf.to_parquet(output_parquet_path)

    print("
Conversion successful!")
    print(f"Output file created at: {output_parquet_path}")

except Exception as e:
    print(f"
An error occurred: {e}")
    print("Please check the following:")
    print(f"1. Ensure the file '{input_shapefile_path}' exists.")
