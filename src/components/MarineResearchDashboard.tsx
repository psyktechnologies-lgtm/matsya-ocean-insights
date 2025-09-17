import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Grid, Card, CardContent, useTheme, Button, Switch } from '@mui/material';
import { BarChart, PieChart, AreaChart } from 'recharts';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScienceIcon from '@mui/icons-material/Science';
import MapIcon from '@mui/icons-material/Map';
import MemoryIcon from '@mui/icons-material/Memory';
import { useQuery } from '@tanstack/react-query';

// Sample stats data
const stats = [
  { label: 'Total Species', value: 12834, icon: <ScienceIcon color="primary" /> },
  { label: 'Active Datasets', value: 42, icon: <DashboardIcon color="primary" /> },
  { label: 'Analyses Completed', value: 312, icon: <MemoryIcon color="primary" /> },
  { label: 'ML Predictions', value: 1209, icon: <MemoryIcon color="primary" /> },
];

// Placeholder chart data
const speciesDistribution = [
  { year: 2015, count: 200 },
  { year: 2016, count: 400 },
  { year: 2017, count: 800 },
  { year: 2018, count: 1600 },
  { year: 2019, count: 3200 },
  { year: 2020, count: 6400 },
];

const biodiversityRegions = [
  { region: 'Bay of Bengal', count: 3200 },
  { region: 'Indian Ocean', count: 2100 },
  { region: 'Pacific', count: 1800 },
];

const conservationStatus = [
  { status: 'Least Concern', value: 9000 },
  { status: 'Vulnerable', value: 2000 },
  { status: 'Endangered', value: 800 },
  { status: 'Critically Endangered', value: 34 },
];

// Theme toggle
const ThemeToggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <Box display="flex" alignItems="center">
    <Typography variant="body2" sx={{ mr: 1 }}>Dark Mode</Typography>
    <Switch checked={checked} onChange={onChange} color="primary" />
  </Box>
);

const MarineResearchDashboard: React.FC = () => {
  const theme = useTheme();
  const [darkMode, setDarkMode] = React.useState(false);

  // Example React Query usage for stats (replace with real API)
  // const { data, isLoading, error } = useQuery(['dashboardStats'], fetchDashboardStats);

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
      {/* Header & Navigation */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Marine Research Dashboard
          </Typography>
          <Button color="inherit" startIcon={<ScienceIcon />}>Species</Button>
          <Button color="inherit" startIcon={<MemoryIcon />}>Analysis</Button>
          <Button color="inherit" startIcon={<MapIcon />}>Maps</Button>
          <Button color="inherit" startIcon={<DashboardIcon />}>ML Tools</Button>
          <ThemeToggle checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </Toolbar>
      </AppBar>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ p: 3 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>{stat.icon}</Box>
                  <Typography variant="h5" fontWeight="bold">{stat.value}</Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={2} sx={{ p: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Species Distribution Over Time</Typography>
              {/* AreaChart placeholder */}
              {/* <AreaChart ... /> */}
              <Box sx={{ height: 200, bgcolor: '#e3f2fd', borderRadius: 2, mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Biodiversity by Marine Regions</Typography>
              {/* BarChart placeholder */}
              <Box sx={{ height: 200, bgcolor: '#e0f7fa', borderRadius: 2, mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Conservation Status Breakdown</Typography>
              {/* PieChart placeholder */}
              <Box sx={{ height: 200, bgcolor: '#fce4ec', borderRadius: 2, mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MarineResearchDashboard;
