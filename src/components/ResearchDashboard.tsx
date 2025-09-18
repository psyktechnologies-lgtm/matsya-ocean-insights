import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Microscope, 
  Fish, 
  BookOpen, 
  FileText, 
  Database, 
  Map,
  Dna,
  Eye,
  ChevronRight,
  Activity,
  Users,
  Globe,
  Waves,
  Anchor,
  Shell,
  Zap
} from 'lucide-react';

const ResearchDashboard: React.FC = () => {
  const navigate = useNavigate();

  const researchCategories = [
    {
      id: 'taxonomy',
      title: 'Taxonomy Research',
      description: 'Upload and analyze taxonomic datasets, species classification, and biodiversity studies',
      icon: <Database className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      path: '/taxonomy',
      features: ['Darwin Core Support', 'Species Classification', 'Biodiversity Analysis', 'Data Validation'],
      status: 'Active',
      bgPattern: 'bg-blue-50 dark:bg-blue-950/20'
    },
    {
      id: 'otolith',
      title: 'Otolith Analysis',
      description: 'Fish age determination and growth analysis through otolith structure examination',
      icon: <Fish className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-green-500 to-emerald-500',
      path: '/otolith',
      features: ['Age Determination', 'Growth Analysis', 'Image Processing', 'Statistical Models'],
      status: 'Active',
      bgPattern: 'bg-green-50 dark:bg-green-950/20'
    },
    {
      id: 'edna',
      title: 'eDNA Analysis',
      description: 'Environmental DNA sequencing, metabarcoding, and species detection from water samples',
      icon: <Dna className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-purple-500 to-indigo-500',
      path: '/edna',
      features: ['Sequence Analysis', 'Metabarcoding', 'Species Detection', 'Quality Control'],
      status: 'Active',
      bgPattern: 'bg-purple-50 dark:bg-purple-950/20'
    },
    {
      id: 'research-paper',
      title: 'Research Publishing',
      description: 'Submit, collaborate, and publish marine research papers with peer review system',
      icon: <FileText className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-orange-500 to-red-500',
      path: '/research-publishing',
      features: ['Manuscript Submission', 'Peer Review', 'Collaboration Tools', 'Publication Management'],
      status: 'New',
      bgPattern: 'bg-orange-50 dark:bg-orange-950/20'
    }
  ];

  const quickActions = [
    {
      title: '3D Marine Map',
      description: 'Explore real-time marine data on interactive 3D globe',
      icon: <Globe className="h-6 w-6" />,
      path: '/marine-map',
      color: 'text-blue-600',
      accent: 'bg-blue-100'
    },
    {
      title: 'Real-time Analytics',
      description: 'View live marine data streams and analytics',
      icon: <Activity className="h-6 w-6" />,
      path: '/analytics',
      color: 'text-green-600',
      accent: 'bg-green-100'
    },
    {
      title: 'Species Explorer',
      description: 'Browse and search marine species database',
      icon: <Eye className="h-6 w-6" />,
      path: '/species',
      color: 'text-purple-600',
      accent: 'bg-purple-100'
    },
    {
      title: 'Community Hub',
      description: 'Connect with marine researchers worldwide',
      icon: <Users className="h-6 w-6" />,
      path: '/community',
      color: 'text-orange-600',
      accent: 'bg-orange-100'
    }
  ];

  const handleCategorySelect = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Ocean Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="wave-animation absolute inset-0"></div>
        </div>
        {/* Floating marine elements */}
        <div className="absolute top-20 left-10 opacity-30 animate-pulse">
          <Anchor className="h-12 w-12 text-blue-300" />
        </div>
        <div className="absolute top-40 right-20 opacity-20 animate-bounce">
          <Shell className="h-8 w-8 text-cyan-300" />
        </div>
        <div className="absolute bottom-20 left-1/4 opacity-25 animate-pulse">
          <Fish className="h-10 w-10 text-teal-300" />
        </div>
        <div className="absolute top-60 right-1/4 opacity-30 animate-pulse">
          <Waves className="h-14 w-14 text-blue-300" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with Ocean Theme */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Microscope className="h-16 w-16 text-cyan-300 mr-4 animate-pulse" />
              <div className="absolute -top-2 -right-2">
                <Zap className="h-6 w-6 text-yellow-400 animate-ping" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white tracking-wide">
              Marine Research Hub
            </h1>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-2xl text-cyan-100 mb-4 font-light">
              Dive Deep into Marine Science Discovery
            </p>
            <p className="text-lg text-blue-200 opacity-90">
              Choose your research pathway and access advanced tools for comprehensive marine research
            </p>
          </div>
        </div>

        {/* Research Categories with Ocean Theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {researchCategories.map((category) => (
            <Card 
              key={category.id} 
              className={`group hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 hover:border-cyan-400 dark:hover:border-cyan-500 backdrop-blur-sm bg-white/10 dark:bg-gray-900/20 hover:bg-white/20 hover:scale-105 ${category.bgPattern}`}
              onClick={() => handleCategorySelect(category.path)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`p-4 rounded-xl ${category.color} text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    {category.icon}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={category.status === 'New' ? 'default' : 'secondary'}
                      className={category.status === 'New' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse' : ''}
                    >
                      {category.status}
                    </Badge>
                    <ChevronRight className="h-6 w-6 text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-semibold text-white group-hover:text-cyan-300 transition-colors duration-300">
                  {category.title}
                </CardTitle>
                <CardDescription className="text-cyan-100 text-base leading-relaxed">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium text-cyan-200">Key Features:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {category.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-blue-100 group-hover:text-white transition-colors duration-300">
                        <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mr-3 animate-pulse"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions with Ocean Animation */}
        <Card className="mb-8 backdrop-blur-sm bg-white/10 dark:bg-gray-900/20 border-cyan-400/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center text-white text-2xl">
              <Map className="h-8 w-8 mr-3 text-cyan-400" />
              Quick Access Tools
              <Waves className="h-6 w-6 ml-3 text-cyan-300 animate-pulse" />
            </CardTitle>
            <CardDescription className="text-cyan-100 text-lg">
              Frequently used research tools and marine resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-start space-y-3 hover:shadow-lg transition-all duration-300 bg-white/5 hover:bg-white/15 border-cyan-400/30 hover:border-cyan-400 text-white hover:text-cyan-100 hover:scale-105"
                  onClick={() => navigate(action.path)}
                >
                  <div className={`p-3 rounded-lg ${action.accent} ${action.color} transition-colors duration-300`}>
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-lg">{action.title}</div>
                    <div className="text-sm text-cyan-200 mt-1 leading-relaxed">
                      {action.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Getting Started with Ocean Theme */}
        <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/20 border-cyan-400/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center text-white text-2xl">
              <BookOpen className="h-8 w-8 mr-3 text-cyan-400" />
              Dive Into Marine Research
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 p-6 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-400/30">
                <h4 className="font-semibold text-xl text-white">New to Marine Research?</h4>
                <p className="text-cyan-100 leading-relaxed">
                  Start with our guided tutorials and sample datasets to learn the platform.
                </p>
                <Button variant="link" className="p-0 h-auto text-cyan-300 hover:text-cyan-200 font-medium">
                  View Tutorials →
                </Button>
              </div>
              <div className="space-y-3 p-6 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30">
                <h4 className="font-semibold text-xl text-white">Need Help?</h4>
                <p className="text-green-100 leading-relaxed">
                  Access documentation, API references, and community support.
                </p>
                <Button variant="link" className="p-0 h-auto text-green-300 hover:text-green-200 font-medium">
                  Get Support →
                </Button>
              </div>
              <div className="space-y-3 p-6 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-400/30">
                <h4 className="font-semibold text-xl text-white">Share Your Research</h4>
                <p className="text-purple-100 leading-relaxed">
                  Publish findings and collaborate with the global marine research community.
                </p>
                <Button variant="link" className="p-0 h-auto text-purple-300 hover:text-purple-200 font-medium">
                  Learn More →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CSS for wave animation in global styles */}
    </div>
  );
};

export default ResearchDashboard;