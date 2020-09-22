#!/usr/bin/env node
const exec = require('child_process').execSync
const fs = require('fs')
const rimraf = require('rimraf')

// generate bathymetry tiles from merged and styled bathymetry tiff (see qgis project)
// exec('gdal2tiles.py ./data/bathymetry_merged_styled.tif ./tiles/bathymetry --zoom 0-8 --xyz --webviewer=none')

// vector
const VECTOR_TILES_PATH = 'tiles/vector'
const CONVERT_TO_GEOJSON = false
const MAX_ZOOM = 6

let cmd = ''

const layers = [
<<<<<<< HEAD
  // {
  //   name: 'countries',
  //   input: 'data/gadm36_levels_shp/gadm36_0.shp',
  //   tippecanoe: '--drop-densest-as-needed',
  // },
  // {
  //   name: 'regions',
  //   input: 'data/gadm36_levels_shp/gadm36_1.shp',
  //   tippecanoe: '--drop-densest-as-needed',
  // },
  // {
  //   name: 'country_centroids',
  //   geojson: 'data/country_centroids.geojson',
  //   tippecanoe: '--no-tile-size-limit --base-zoom=0'
  // },
  // {
  //   name: 'populated_places',
  //   input: 'data/populated-places/populated-places.shp',
  //   // TODO filter our by admin level
  //   tippecanoe: '--no-tile-size-limit --base-zoom=0'
  // },
=======
  {
    name: 'countries',
    input: 'data/gadm36_levels_shp/gadm36_0.shp',
    tippecanoe: '--drop-densest-as-needed',
    skip: true
  },
  {
    name: 'regions',
    input: 'data/gadm36_levels_shp/gadm36_1.shp',
    tippecanoe: '--drop-densest-as-needed',
    minzoom: 5
  },
  {
    name: 'country_centroids',
    geojson: 'data/country_centroids.geojson',
    tippecanoe: '--no-tile-size-limit --base-zoom=0',
    skip: true
  },
  {
    name: 'populated_places',
    input: 'data/populated-places/populated-places.shp',
    // TODO filter our by admin level
    tippecanoe: '--no-tile-size-limit --base-zoom=0',
    skip: true
  },
>>>>>>> ec169c1af249fcc882e43e981244f83b90e825bd
  {
    name: 'graticules',
    // input: 'data/ne_110m_graticules_all/ne_110m_graticules_1.shp',
    geojson: 'data/graticules-clean.geojson',
<<<<<<< HEAD
    tippecanoe: '--no-tile-size-limit --base-zoom=0'
=======
    tippecanoe: '--no-tile-size-limit --base-zoom=0',
    // skip: true
>>>>>>> ec169c1af249fcc882e43e981244f83b90e825bd
  },
]

const allmbtiles = layers.map(layer => {
  const geojson = layer.geojson || `out/${layer.name}.geojson`
  const mbtiles = layer.mbtiles || `out/${layer.name}.mbtiles`
  const minzoom = layer.minzoom || 0
  if (layer.input && CONVERT_TO_GEOJSON && layer.skip !== true) {
    exec(`yarn mapshaper ${layer.input} -o format=geojson ${geojson}`)
  }
  cmd = `tippecanoe --minimum-zoom=${minzoom} --maximum-zoom=${MAX_ZOOM} -o ${mbtiles} ${layer.tippecanoe} ${geojson} --layer=${layer.name} --force`
  if (layer.skip !== true) {
    console.log(cmd)
    exec(cmd)
  }
  return mbtiles
})

rimraf.sync(VECTOR_TILES_PATH)
fs.mkdirSync(VECTOR_TILES_PATH)

const mergeCmd = `tile-join ${allmbtiles.join(' ')} --no-tile-size-limit --output-to-directory=${VECTOR_TILES_PATH}`
console.log(mergeCmd)
exec(mergeCmd)

exec('gsutil cp -r tiles/** gs://public-tiles/basemap')