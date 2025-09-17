
import React, { useRef, useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, IconButton, Drawer, List, ListItem, ListItemText, Chip, Button } from '@mui/material';
import * as Cesium from 'cesium';
import RoomIcon from '@mui/icons-material/Room';
import LayersIcon from '@mui/icons-material/Layers';
import { SpeciesOccurrence } from './SpeciesExplorer';
import { fetchSpecies } from '@/lib/api';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useQueryClient } from '@tanstack/react-query';
import type { Species } from '../types/database';

// Cesium Ion access token
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1N2JjYWI1Ni0zMTk1LTQ5YWEtYTkyYy1mYjQzZjc0YjQwMGQiLCJpZCI6MzQxODgxLCJpYXQiOjE3NTgwNDMxODB9.I43fy6JSp5CAA3v1JRBFzNX_S-VdytgwqOT-j4chVEg';

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
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesOccurrence | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [layer, setLayer] = useState<'species' | 'heatmap' | 'temperature' | 'depth'>('species');

  const queryClient = useQueryClient();

  // WebSocket hook at top-level
  const { messages } = useWebSocket('/ws/updates');

  useEffect(() => {
    const initializeCesium = async () => {
      if (cesiumContainer.current && !viewerRef.current) {
        // Initialize Cesium viewer
        const terrainProvider = await Cesium.createWorldTerrainAsync();
        viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
          terrainProvider,
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          animation: false,
          timeline: false,
          fullscreenButton: false,
          vrButton: false,
          infoBox: true,
          selectionIndicator: true,
        });

        // Set initial view to Bay of Bengal region
        viewerRef.current.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(91.5, 22.2, 1000000), // Bay of Bengal
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-45),
            roll: 0.0,
          },
        });

        setLoading(false);
      }
    };

    initializeCesium();

    // Fetch species data and add markers
    let mounted = true;
    (async () => {
      try {
        const resp = await fetchSpecies();
        if (mounted && viewerRef.current) {
          // Convert Species to SpeciesOccurrence format
          const data: SpeciesOccurrence[] = resp.map(s => ({
            id: s.id,
            scientificName: s.scientific_name,
            commonName: s.common_name,
            latitude: s.latitude || 0,
            longitude: s.longitude || 0,
            depth: s.depth_range ? parseFloat(s.depth_range.split('-')[0]) : undefined,
            dataSource: 'Database',
            conservationStatus: s.conservation_status,
            family: s.family,
            habitat: s.habitat,
            recordedDate: s.created_at,
            qualityGrade: 'research'
          }));

          // Add species markers to the map
          data.forEach((species) => {
            const entity = viewerRef.current!.entities.add({
              position: Cesium.Cartesian3.fromDegrees(species.longitude, species.latitude),
              billboard: {
                image: 'data:image/svg+xml;base64,' + btoa(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" fill="#0077be" stroke="white" stroke-width="2"/>
                    <circle cx="12" cy="12" r="4" fill="white"/>
                  </svg>
                `),
                scale: 1.0,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              },
              label: {
                text: species.commonName || species.scientificName,
                font: '12pt monospace',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -50),
                show: false, // Initially hidden
              },
              description: `
                <div style="font-family: Arial; max-width: 300px;">
                  <h3>${species.scientificName}</h3>
                  <p><strong>Common Name:</strong> ${species.commonName || 'N/A'}</p>
                  <p><strong>Family:</strong> ${species.family || 'N/A'}</p>
                  <p><strong>Conservation Status:</strong> ${species.conservationStatus || 'N/A'}</p>
                  <p><strong>Depth:</strong> ${species.depth ? `${species.depth} m` : 'N/A'}</p>
                  <p><strong>Location:</strong> ${species.latitude.toFixed(4)}, ${species.longitude.toFixed(4)}</p>
                  <p><strong>Data Source:</strong> ${species.dataSource}</p>
                </div>
              `,
            });

            // Store species data with entity for click handling
            (entity as any).speciesData = species;
          });

          // Handle entity selection
          viewerRef.current.selectedEntityChanged.addEventListener(() => {
            const selectedEntity = viewerRef.current!.selectedEntity;
            if (selectedEntity && (selectedEntity as any).speciesData) {
              setSelectedSpecies((selectedEntity as any).speciesData);
            }
          });
        }
      } catch (e) {
        console.warn('Failed to fetch species for map', e);
      }
    })();

    return () => { 
      mounted = false;
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  // React to websocket messages
  useEffect(() => {
    const latestMsg = messages[messages.length - 1];
    if (latestMsg && (latestMsg.type === 'obis_sync' || latestMsg.type === 'classification')) {
      queryClient.invalidateQueries({ queryKey: ['speciesData'] });
    }
  }, [messages, queryClient]);

  // Layer controls
  const handleLayerChange = (newLayer: typeof layer) => {
    setLayer(newLayer);
    if (viewerRef.current) {
      switch (newLayer) {
        case 'species':
          // Show species markers
          viewerRef.current.entities.values.forEach(entity => {
            if (entity.billboard) entity.show = true;
          });
          break;
        case 'heatmap':
          // TODO: Add heatmap layer
          break;
        case 'temperature':
          // TODO: Add temperature layer
          break;
        case 'depth':
          // TODO: Add depth layer
          break;
      }
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '600px', width: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
      {loading && (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', zIndex: 2, transform: 'translate(-50%, -50%)' }}>
          <CircularProgress />
        </Box>
      )}
      <Box ref={cesiumContainer} sx={{ height: '100%', width: '100%' }} />
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
              <ListItem 
                key={s.id} 
                onClick={() => setSelectedSpecies(s)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
              >
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