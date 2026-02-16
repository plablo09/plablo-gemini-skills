// Version control for tile caching. Bump this when backend data schema changes.
const TILE_VERSION = 'v1.0';

// Color palette configuration
const DATA_COLORS = {{COLOR_EXPRESSION}};

// Initialize the map
const map = new maplibregl.Map({
    container: 'map', // The ID of the div in index.html
    // A minimal, self-contained style object. This removes the need for an external API key.
    style: {
        'version': 8,
        'sources': {
            // OpenStreetMap Raster Tiles
            'osm': {
                'type': 'raster',
                'tiles': [
                    'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
                ],
                'tileSize': 256,
                'attribution': '&copy; OpenStreetMap Contributors',
                'maxzoom': 19
            },
            // Our vector tile source from the local backend
            '{{SOURCE_ID}}': {
                'type': 'vector',
                'tiles': [window.location.origin + `/tiles/{z}/{x}/{y}.pbf?v=${TILE_VERSION}`],
                'minzoom': {{MIN_ZOOM}},
                'maxzoom': {{MAX_ZOOM}}
            }
        },
        'layers': [
            // OSM Background
            {
                'id': 'osm',
                'type': 'raster',
                'source': 'osm',
                'paint': {}
            },
            // Our layer to display the features fill
            {
                'id': '{{SOURCE_ID}}-fill',
                'type': 'fill',
                'source': '{{SOURCE_ID}}',
                'source-layer': '{{LAYER_NAME}}', // Must match the name in the backend
                'layout': {},
                'paint': {
                    'fill-color': DATA_COLORS,
                    'fill-opacity': 0.6
                }
            },
            // A separate layer for the outline
            {
                'id': '{{SOURCE_ID}}-outline',
                'type': 'line',
                'source': '{{SOURCE_ID}}',
                'source-layer': '{{LAYER_NAME}}',
                'layout': {},
                'paint': {
                    'line-color': '#003',
                    'line-width': 0.5,
                    'line-opacity': 0.3
                }
            },
            // 3D Extrusion layer (initially hidden/invisible)
            {
                'id': '{{SOURCE_ID}}-extrusion',
                'type': 'fill-extrusion',
                'source': '{{SOURCE_ID}}',
                'source-layer': '{{LAYER_NAME}}',
                'paint': {
                    'fill-extrusion-color': DATA_COLORS,
                    'fill-extrusion-height': {{EXTRUSION_HEIGHT_EXPRESSION}},
                    'fill-extrusion-base': 0,
                    'fill-extrusion-opacity': 0.8
                },
                'layout': {
                    'visibility': 'none'
                }
            }
        ]
    },
    center: {{MAP_CENTER}}, // Starting position [lng, lat]
    zoom: {{INITIAL_ZOOM}} // Starting zoom level
});

// Add zoom and rotation controls to the map.
map.addControl(new maplibregl.NavigationControl());

// Update zoom level display
const zoomDisplay = document.getElementById('zoom-value');
function updateZoom() {
    zoomDisplay.innerText = map.getZoom().toFixed(2);
}

map.on('load', updateZoom);
map.on('move', updateZoom);

// View Toggle Logic
let is3D = false;
const toggleBtn = document.getElementById('view-toggle');

toggleBtn.addEventListener('click', () => {
    is3D = !is3D;
    
    if (is3D) {
        // Switch to 3D
        map.easeTo({
            pitch: 60,
            bearing: -20,
            duration: 1000
        });
        
        map.setLayoutProperty('{{SOURCE_ID}}-extrusion', 'visibility', 'visible');
        map.setLayoutProperty('{{SOURCE_ID}}-fill', 'visibility', 'none');
        map.setLayoutProperty('{{SOURCE_ID}}-outline', 'visibility', 'none');
        
        toggleBtn.innerText = 'Switch to 2D';
    } else {
        // Switch to 2D
        map.easeTo({
            pitch: 0,
            bearing: 0,
            duration: 1000
        });
        
        map.setLayoutProperty('{{SOURCE_ID}}-extrusion', 'visibility', 'none');
        map.setLayoutProperty('{{SOURCE_ID}}-fill', 'visibility', 'visible');
        map.setLayoutProperty('{{SOURCE_ID}}-outline', 'visibility', 'visible');
        
        toggleBtn.innerText = 'Switch to 3D';
    }
});
