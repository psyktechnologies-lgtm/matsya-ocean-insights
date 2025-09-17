import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, Fish, Microscope, Dna } from 'lucide-react';

// Sample marine data for different classifications
const marineData = {
  taxonomy: [
    { id: 1, name: 'Thunnus albacares', common: 'Yellowfin Tuna', coordinates: [73.8567, 18.5204], family: 'Scombridae' },
    { id: 2, name: 'Katsuwonus pelamis', common: 'Skipjack Tuna', coordinates: [72.8777, 19.0760], family: 'Scombridae' },
    { id: 3, name: 'Rastrelliger kanagurta', common: 'Indian Mackerel', coordinates: [76.2673, 9.9312], family: 'Scombridae' },
  ],
  otolith: [
    { id: 1, species: 'Lutjanus argentimaculatus', shape: 'Oval', coordinates: [75.7139, 11.2588], morphotype: 'Type A' },
    { id: 2, species: 'Epinephelus malabaricus', shape: 'Irregular', coordinates: [74.1240, 15.2993], morphotype: 'Type B' },
    { id: 3, species: 'Lethrinus lentjan', shape: 'Elongated', coordinates: [72.5714, 23.0225], morphotype: 'Type C' },
  ],
  species: [
    { id: 1, name: 'Chelonia mydas', common: 'Green Sea Turtle', coordinates: [68.9685, 22.3039], status: 'Endangered' },
    { id: 2, name: 'Rhincodon typus', common: 'Whale Shark', coordinates: [69.0178, 23.0225], status: 'Vulnerable' },
    { id: 3, name: 'Mobula birostris', common: 'Giant Manta Ray', coordinates: [70.0578, 21.5222], status: 'Vulnerable' },
  ],
  edna: [
    { id: 1, sequence: 'COI-001', species: 'Sardinella longiceps', coordinates: [75.3412, 11.9416], confidence: 98.5 },
    { id: 2, sequence: 'COI-002', species: 'Decapterus russelli', coordinates: [74.7833, 12.9716], confidence: 95.2 },
    { id: 3, sequence: '16S-001', species: 'Stolephorus commersonnii', coordinates: [73.6833, 15.4909], confidence: 97.8 },
  ]
};

interface MarineMapProps {
  className?: string;
}

const MarineMap: React.FC<MarineMapProps> = ({ className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [activeLayers, setActiveLayers] = useState<string[]>(['taxonomy']);
  const [selectedPoint, setSelectedPoint] = useState<any>(null);

  const toggleLayer = (layerName: string) => {
    setActiveLayers(prev => 
      prev.includes(layerName) 
        ? prev.filter(l => l !== layerName)
        : [...prev, layerName]
    );
  };

  const getLayerIcon = (layerName: string) => {
    switch (layerName) {
      case 'taxonomy': return <Fish className="h-4 w-4" />;
      case 'otolith': return <Microscope className="h-4 w-4" />;
      case 'species': return <Layers className="h-4 w-4" />;
      case 'edna': return <Dna className="h-4 w-4" />;
      default: return <Layers className="h-4 w-4" />;
    }
  };

  const getLayerColor = (layerName: string) => {
    switch (layerName) {
      case 'taxonomy': return '#3B82F6'; // Blue
      case 'otolith': return '#10B981'; // Green
      case 'species': return '#F59E0B'; // Orange
      case 'edna': return '#8B5CF6'; // Purple
      default: return '#6B7280';
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [75.0, 15.0], // Indian Ocean
      zoom: 5,
      pitch: 0,
      bearing: 0
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for each data layer
    const addMarkersForLayer = (layerName: string, data: any[], color: string) => {
      data.forEach((item) => {
        const el = document.createElement('div');
        el.className = `marker-${layerName}`;
        el.style.backgroundColor = color;
        el.style.width = '12px';
        el.style.height = '12px';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.cursor = 'pointer';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

        el.addEventListener('click', () => {
          setSelectedPoint({ ...item, layer: layerName });
        });

        new mapboxgl.Marker(el)
          .setLngLat(item.coordinates)
          .addTo(map.current!);
      });
    };

    // Add markers for all active layers
    if (activeLayers.includes('taxonomy')) {
      addMarkersForLayer('taxonomy', marineData.taxonomy, getLayerColor('taxonomy'));
    }
    if (activeLayers.includes('otolith')) {
      addMarkersForLayer('otolith', marineData.otolith, getLayerColor('otolith'));
    }
    if (activeLayers.includes('species')) {
      addMarkersForLayer('species', marineData.species, getLayerColor('species'));
    }
    if (activeLayers.includes('edna')) {
      addMarkersForLayer('edna', marineData.edna, getLayerColor('edna'));
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, activeLayers]);

  if (!mapboxToken) {
    return (
      <div className={`relative w-full h-full bg-gradient-subtle flex items-center justify-center ${className}`}>
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Configure Map</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter your Mapbox public token to enable the marine data map.
            </p>
            <input
              type="text"
              placeholder="Enter Mapbox public token..."
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Get your token from <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full bg-gradient-subtle ${className}`}>
      {/* Layer Controls */}
      <div className="absolute top-4 left-4 z-10">
        <Card className="w-64">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Data Layers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.keys(marineData).map((layerName) => (
              <Button
                key={layerName}
                variant={activeLayers.includes(layerName) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleLayer(layerName)}
                className="w-full justify-start"
              >
                {getLayerIcon(layerName)}
                <span className="ml-2 capitalize">{layerName}</span>
                <Badge variant="secondary" className="ml-auto">
                  {marineData[layerName as keyof typeof marineData].length}
                </Badge>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Selected Point Info */}
      {selectedPoint && (
        <div className="absolute top-4 right-4 z-10">
          <Card className="w-80">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  {getLayerIcon(selectedPoint.layer)}
                  {selectedPoint.layer.charAt(0).toUpperCase() + selectedPoint.layer.slice(1)} Data
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPoint(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {selectedPoint.layer === 'taxonomy' && (
                <>
                  <div><strong>Species:</strong> <em>{selectedPoint.name}</em></div>
                  <div><strong>Common Name:</strong> {selectedPoint.common}</div>
                  <div><strong>Family:</strong> {selectedPoint.family}</div>
                </>
              )}
              {selectedPoint.layer === 'otolith' && (
                <>
                  <div><strong>Species:</strong> <em>{selectedPoint.species}</em></div>
                  <div><strong>Shape:</strong> {selectedPoint.shape}</div>
                  <div><strong>Morphotype:</strong> {selectedPoint.morphotype}</div>
                </>
              )}
              {selectedPoint.layer === 'species' && (
                <>
                  <div><strong>Species:</strong> <em>{selectedPoint.name}</em></div>
                  <div><strong>Common Name:</strong> {selectedPoint.common}</div>
                  <div><strong>Status:</strong> 
                    <Badge variant={selectedPoint.status === 'Endangered' ? 'destructive' : 'default'} className="ml-2">
                      {selectedPoint.status}
                    </Badge>
                  </div>
                </>
              )}
              {selectedPoint.layer === 'edna' && (
                <>
                  <div><strong>Sequence ID:</strong> {selectedPoint.sequence}</div>
                  <div><strong>Species:</strong> <em>{selectedPoint.species}</em></div>
                  <div><strong>Confidence:</strong> {selectedPoint.confidence}%</div>
                </>
              )}
              <div className="text-xs text-muted-foreground pt-2">
                Coordinates: {selectedPoint.coordinates[1].toFixed(4)}°N, {selectedPoint.coordinates[0].toFixed(4)}°E
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full rounded-lg shadow-lg" style={{ minHeight: '500px' }} />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="w-64">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Legend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.keys(marineData).map((layerName) => (
              <div key={layerName} className={`flex items-center gap-2 text-sm ${!activeLayers.includes(layerName) ? 'opacity-50' : ''}`}>
                <div 
                  className="w-3 h-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: getLayerColor(layerName) }}
                />
                <span className="capitalize">{layerName}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="w-72">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              🌊 Marine Data Classification System
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Integrated OBIS, IndOBIS & CMLRE datasets with real-time visualization
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarineMap;