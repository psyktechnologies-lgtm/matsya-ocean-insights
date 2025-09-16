import { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Set Cesium Ion access token (you'll need to get this from cesium.com)
Cesium.Ion.defaultAccessToken = 'YOUR_CESIUM_ION_TOKEN';

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

    // Mock OBIS data points (replace with real API calls)
    const mockObisData = [
      { lon: 72.8777, lat: 19.0760, species: 'Tuna', count: 150 },
      { lon: 77.5946, lat: 12.9716, species: 'Dolphin', count: 45 },
      { lon: 80.2707, lat: 13.0827, species: 'Whale', count: 12 },
      { lon: 88.3639, lat: 22.5726, species: 'Shark', count: 78 },
      { lon: 87.8550, lat: 21.2514, species: 'Stingray', count: 92 },
    ];

    // Add data points to the map
    mockObisData.forEach((dataPoint) => {
      const entity = viewer.current!.entities.add({
        position: Cesium.Cartesian3.fromDegrees(dataPoint.lon, dataPoint.lat),
        point: {
          pixelSize: 10,
          color: Cesium.Color.CYAN,
          outlineColor: Cesium.Color.DARKBLUE,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
        label: {
          text: `${dataPoint.species}: ${dataPoint.count}`,
          font: '12pt sans-serif',
          pixelOffset: new Cesium.Cartesian2(0, -40),
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        },
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
          <p className="text-sm text-muted-foreground">
            Interactive 3D map showing real-time marine biodiversity data from OBIS and IndOBIS databases.
            Click on markers to explore species distribution and population data.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CesiumMap;