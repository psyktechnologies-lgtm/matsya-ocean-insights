
import React, { useRef, useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, IconButton, Drawer, List, ListItem, ListItemText, Chip, Button } from '@mui/material';
import MapboxGL from 'mapbox-gl';
import RoomIcon from '@mui/icons-material/Room';
import LayersIcon from '@mui/icons-material/Layers';
import { SpeciesOccurrence } from './SpeciesExplorer';
import { fetchSpecies } from '@/lib/api';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useQueryClient } from '@tanstack/react-query';

// Mapbox access token (replace with your own for production)
MapboxGL.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

// Sample species data
const sampleSpecies: SpeciesOccurrence[] = [
  {
    id: '1',
    scientificName: 'Lutjanus campechanus',
    commonName: 'Red Snapper',
    latitude: 22.5,
    longitude: 91.8,
    depth: 30,
    conservationStatus: 'Least Concern',
    family: 'Lutjanidae',
    dataSource: 'OBIS',
  },
  {
    id: '2',
    scientificName: 'Scomberomorus commerson',
    commonName: 'Narrow-barred Spanish mackerel',
    latitude: 21.9,
    longitude: 90.5,
    depth: 15,
    conservationStatus: 'Vulnerable',
    family: 'Scombridae',
    dataSource: 'GBIF',
  },
];

interface MarineMapProps {
  speciesData?: SpeciesOccurrence[];
}

const MarineMap: React.FC<MarineMapProps> = ({ speciesData = sampleSpecies }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxGL.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesOccurrence | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [layer, setLayer] = useState<'species' | 'heatmap' | 'temperature' | 'depth'>('species');

  const queryClient = useQueryClient();

  // WebSocket hook at top-level
  const { messages } = useWebSocket('/ws/updates');

  useEffect(() => {
    // fetch species from backend when component mounts
    let mounted = true;
    (async () => {
      try {
        const resp = await fetchSpecies();
        if (mounted) {
          // replace markers by creating map after data arrives
          if (mapContainer.current && !mapRef.current) {
            mapRef.current = new MapboxGL.Map({
              container: mapContainer.current,
              style: 'mapbox://styles/mapbox/light-v10',
              center: [91.5, 22.2],
              zoom: 5,
            });
            mapRef.current.on('load', () => setLoading(false));
          }
          // add markers
          const data: SpeciesOccurrence[] = resp as SpeciesOccurrence[];
          data.forEach((species) => {
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.background = '#0077be';
            el.style.width = '18px';
            el.style.height = '18px';
            el.style.borderRadius = '50%';
            el.style.boxShadow = '0 0 6px rgba(0,0,0,0.2)';
            el.addEventListener('click', () => setSelectedSpecies(species));
            new MapboxGL.Marker(el)
              .setLngLat([species.longitude, species.latitude])
              .addTo(mapRef.current!);
          });
        }
      } catch (e) {
        console.warn('Failed to fetch species for map', e);
      }
    })();
    return () => { mounted = false; };
  }, [speciesData]);

  // react to websocket messages
  useEffect(() => {
    const latestMsg = messages[messages.length - 1];
    if (latestMsg && (latestMsg.type === 'obis_sync' || latestMsg.type === 'classification')) {
      queryClient.invalidateQueries(['speciesData']);
    }
  }, [messages, queryClient]);

  // Layer controls (mock)
  const handleLayerChange = (newLayer: typeof layer) => {
    setLayer(newLayer);
    // TODO: Add/remove layers (heatmap, temperature, depth) using MapboxGL API
  };

  return (
    <Box sx={{ position: 'relative', height: '600px', width: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
      {loading && (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', zIndex: 2, transform: 'translate(-50%, -50%)' }}>
          <CircularProgress />
        </Box>
      )}
      <Box ref={mapContainer} sx={{ height: '100%', width: '100%' }} />
      {/* Layer Controls */}
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 3, bgcolor: 'rgba(255,255,255,0.9)', borderRadius: 2, p: 1, boxShadow: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Layers</Typography>
        <Button startIcon={<LayersIcon />} size="small" variant={layer === 'species' ? 'contained' : 'outlined'} onClick={() => handleLayerChange('species')}>Species</Button>
        <Button size="small" variant={layer === 'heatmap' ? 'contained' : 'outlined'} onClick={() => handleLayerChange('heatmap')}>Heatmap</Button>
        <Button size="small" variant={layer === 'temperature' ? 'contained' : 'outlined'} onClick={() => handleLayerChange('temperature')}>Temperature</Button>
        <Button size="small" variant={layer === 'depth' ? 'contained' : 'outlined'} onClick={() => handleLayerChange('depth')}>Depth</Button>
      </Box>
      {/* Side Drawer for filtered species */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 320, p: 2 }}>
          <Typography variant="h6">Filtered Species</Typography>
          <List>
            {speciesData.map((s) => (
              <ListItem button key={s.id} onClick={() => setSelectedSpecies(s)}>
                <ListItemText primary={s.scientificName} secondary={s.commonName} />
                <Chip label={s.conservationStatus} size="small" />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      {/* Species Details Popup */}
      {selectedSpecies && (
        <Box sx={{ position: 'absolute', bottom: 24, left: 24, zIndex: 4, bgcolor: 'white', borderRadius: 2, boxShadow: 3, p: 2, minWidth: 300 }}>
          <Typography variant="h6">{selectedSpecies.scientificName}</Typography>
          <Typography variant="subtitle1">{selectedSpecies.commonName}</Typography>
          <Typography variant="body2">Family: {selectedSpecies.family}</Typography>
          <Typography variant="body2">Location: {selectedSpecies.latitude}, {selectedSpecies.longitude}</Typography>
          <Typography variant="body2">Depth: {selectedSpecies.depth ? `${selectedSpecies.depth} m` : '-'}</Typography>
          <Typography variant="body2">Conservation Status: {selectedSpecies.conservationStatus}</Typography>
          <Typography variant="body2">Data Source: {selectedSpecies.dataSource}</Typography>
          <Button sx={{ mt: 1 }} onClick={() => setSelectedSpecies(null)}>Close</Button>
        </Box>
      )}
      {/* Open Drawer Button */}
      <IconButton sx={{ position: 'absolute', top: 16, left: 16, zIndex: 3, bgcolor: 'white', boxShadow: 2 }} onClick={() => setDrawerOpen(true)}>
        <RoomIcon color="primary" />
      </IconButton>
    </Box>
  );
};

export default MarineMap;