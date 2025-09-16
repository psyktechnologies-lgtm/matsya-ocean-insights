import { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Set Cesium Ion access token
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NDk0Y2JkOS1kMGIyLTRjN2UtOTQ3Yi1lOGM3ZDZmMDYzZDEiLCJpZCI6MzQxODgxLCJpYXQiOjE3NTgwNDI3NTd9.IPY3sbI-wVQttJ-FuCRFkSbVjZwliKauHymVu5kBqrs';

const CesiumMap = () => {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewer = useRef<Cesium.Viewer | null>(null);

  useEffect(() => {
    if (!cesiumContainer.current) return;

    // Initialize Cesium viewer
    viewer.current = new Cesium.Viewer(cesiumContainer.current, {
      terrain: Cesium.Terrain.fromWorldTerrain(),
      baseLayerPicker: false,
      vrButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      homeButton: true,
      geocoder: false,
    });

    // Set initial view to Indian Ocean
    viewer.current.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(75.0, 10.0, 15000000.0),
    });

    // Enhanced OBIS marine data points for Indian Ocean region
    const mockObisData = [
      { lon: 72.8777, lat: 19.0760, species: 'Bluefin Tuna', count: 150, depth: 200 },
      { lon: 77.5946, lat: 12.9716, species: 'Bottlenose Dolphin', count: 45, depth: 50 },
      { lon: 80.2707, lat: 13.0827, species: 'Blue Whale', count: 12, depth: 500 },
      { lon: 88.3639, lat: 22.5726, species: 'Great White Shark', count: 78, depth: 300 },
      { lon: 87.8550, lat: 21.2514, species: 'Manta Ray', count: 92, depth: 100 },
      { lon: 75.1712, lat: 15.2993, species: 'Sea Turtle', count: 234, depth: 20 },
      { lon: 74.1240, lat: 15.2993, species: 'Coral Species', count: 1200, depth: 5 },
      { lon: 79.0882, lat: 21.1458, species: 'Jellyfish', count: 890, depth: 30 },
      { lon: 85.8245, lat: 20.9517, species: 'Octopus', count: 156, depth: 80 },
      { lon: 82.7739, lat: 17.6868, species: 'Sea Horse', count: 67, depth: 15 },
    ];

    // Add enhanced marine data points to the map
    mockObisData.forEach((dataPoint, index) => {
      // Different colors based on species type
      let color = Cesium.Color.CYAN;
      let size = 8;
      
      if (dataPoint.species.includes('Whale') || dataPoint.species.includes('Shark')) {
        color = Cesium.Color.RED;
        size = 12;
      } else if (dataPoint.species.includes('Dolphin') || dataPoint.species.includes('Turtle')) {
        color = Cesium.Color.YELLOW;
        size = 10;
      } else if (dataPoint.species.includes('Coral')) {
        color = Cesium.Color.MAGENTA;
        size = 6;
      }
      
      const entity = viewer.current!.entities.add({
        position: Cesium.Cartesian3.fromDegrees(dataPoint.lon, dataPoint.lat, dataPoint.depth),
        point: {
          pixelSize: size,
          color: color,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
        },
        label: {
          text: `🐟 ${dataPoint.species}\n📊 Count: ${dataPoint.count}\n🌊 Depth: ${dataPoint.depth}m`,
          font: '11pt sans-serif',
          pixelOffset: new Cesium.Cartesian2(0, -60),
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          showBackground: true,
          backgroundColor: Cesium.Color.fromAlpha(Cesium.Color.BLACK, 0.7),
          backgroundPadding: new Cesium.Cartesian2(8, 4),
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.0),
        },
        description: `
          <div style="font-family: Arial, sans-serif;">
            <h3>${dataPoint.species}</h3>
            <p><strong>Population Count:</strong> ${dataPoint.count}</p>
            <p><strong>Depth:</strong> ${dataPoint.depth} meters</p>
            <p><strong>Location:</strong> ${dataPoint.lat.toFixed(4)}°N, ${dataPoint.lon.toFixed(4)}°E</p>
            <p><em>Data source: OBIS Marine Biodiversity Database</em></p>
          </div>
        `
      });
    });

    // Cleanup function
    return () => {
      if (viewer.current) {
        viewer.current.destroy();
      }
    };
  }, []);

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>🌊 Real-time Marine Data Map</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={cesiumContainer} className="w-full h-[500px] rounded-b-lg" />
        <div className="p-4 bg-muted/50 rounded-b-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Interactive 3D map showing marine biodiversity data from OBIS and IndOBIS databases.
              Click on markers to explore species distribution and population data.
            </p>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Large Marine Life</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Marine Mammals</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                <span>Fish Species</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Coral & Plants</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CesiumMap;