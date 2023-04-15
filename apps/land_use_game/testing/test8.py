import rasterio
from rasterio.mask import mask
import geopandas as gpd
from shapely.geometry import shape

def clip_raster_to_png(input_file, output_file, multipolygon_geom):
    with rasterio.open(input_file) as src:
        out_image, out_transform = mask(src, multipolygon_geom, crop=True)
        out_meta = src.meta.copy()

    out_meta.update({
        "driver": "PNG",
        "height": out_image.shape[1],
        "width": out_image.shape[2],
        "transform": out_transform,
        "count": 1,
        "compress": "deflate"
    })

    with rasterio.open(output_file, 'w', **out_meta) as dest:
        dest.write(out_image)

# Load the multipolygon from a GeoJSON file
multipolygon_file = 'Bláskógabyggð_full.geojson'
multipolygon_geojson = gpd.read_file(multipolygon_file)
multipolygon_gdf = gpd.GeoDataFrame.from_features(multipolygon_geojson)
multipolygon_gdf.crs = "EPSG:4326"

zmasl_file = "IslandsDEMv1.0_10x10m_isn2016_zmasl.tif"
shade_file = "IslandsDEMv1.0_10x10m_isn2016_shade.tif"
daylight_file = "IslandsDEMv1.0_10x10m_isn2016_daylight.tif"

# Reproject the multipolygon to the same CRS as the DEM file
with rasterio.open(zmasl_file) as src:
    dem_crs = src.crs
    if multipolygon_gdf.crs != dem_crs:
        multipolygon_gdf = multipolygon_gdf.to_crs(dem_crs)

multipolygon_geom = multipolygon_gdf.geometry.values.tolist()

# Clip the DEM file
with rasterio.open(zmasl_file) as src:
    out_image, out_transform = mask(src, multipolygon_geom, crop=True)
    out_meta = src.meta

out_meta.update({
    "driver": "GTiff",
    "height": out_image.shape[1],
    "width": out_image.shape[2],
    "transform": out_transform
})

with rasterio.open('clipped_dem.tif', 'w', **out_meta) as dest:
    dest.write(out_image)

# Clip the shade and daylight files and save them as PNGs
clip_raster_to_png(shade_file, 'clipped_shade.png', multipolygon_geom)
clip_raster_to_png(daylight_file, 'clipped_daylight.png', multipolygon_geom)
