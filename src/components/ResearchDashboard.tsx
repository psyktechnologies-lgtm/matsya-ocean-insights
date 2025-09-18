import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
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
  Zap,
  Sparkles,
  Target,
  Compass
} from 'lucide-react';

const ResearchDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const researchCategories = [
    {
      id: 'taxonomy',
      title: 'Taxonomy Research',
      description: 'Upload and analyze taxonomic datasets, species classification, and biodiversity studies',
      icon: <Database className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      path: '/dashboard/taxonomy',
      features: ['Darwin Core Support', 'Species Classification', 'Biodiversity Analysis', 'Data Validation'],
      status: 'Active',
      bgPattern: 'bg-blue-50 dark:bg-blue-950/20 ocean:bg-blue-900/30',
      hoverGlow: 'hover:shadow-blue-500/25',
      iconColor: 'text-blue-600 dark:text-blue-400 ocean:text-cyan-300'
    },
    {
      id: 'otolith',
      title: 'Otolith Analysis',
      description: 'Fish age determination and growth analysis through otolith structure examination',
      icon: <Fish className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-green-500 to-emerald-500',
      path: '/dashboard/otolith',
      features: ['Age Determination', 'Growth Analysis', 'Image Processing', 'Statistical Models'],
      status: 'Active',
      bgPattern: 'bg-green-50 dark:bg-green-950/20 ocean:bg-green-900/30',
      hoverGlow: 'hover:shadow-green-500/25',
      iconColor: 'text-green-600 dark:text-green-400 ocean:text-emerald-300'
    },
    {
      id: 'edna',
      title: 'eDNA Analysis',
      description: 'Environmental DNA sequencing, metabarcoding, and species detection from water samples',
      icon: <Dna className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-purple-500 to-indigo-500',
      path: '/dashboard/edna',
      features: ['Sequence Analysis', 'Metabarcoding', 'Species Detection', 'Quality Control'],
      status: 'Active',
      bgPattern: 'bg-purple-50 dark:bg-purple-950/20 ocean:bg-purple-900/30',
      hoverGlow: 'hover:shadow-purple-500/25',
      iconColor: 'text-purple-600 dark:text-purple-400 ocean:text-indigo-300'
    },
    {
      id: 'research-paper',
      title: 'Research Publishing',
      description: 'Submit, collaborate, and publish marine research papers with peer review system',
      icon: <FileText className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-orange-500 to-red-500',
      path: '/dashboard/research-publishing',
      features: ['Manuscript Submission', 'Peer Review', 'Collaboration Tools', 'Publication Management'],
      status: 'New',
      bgPattern: 'bg-orange-50 dark:bg-orange-950/20 ocean:bg-orange-900/30',
      hoverGlow: 'hover:shadow-orange-500/25',
      iconColor: 'text-orange-600 dark:text-orange-400 ocean:text-red-300'
    }
  ];

  const quickActions = [
    {
      title: '3D Marine Map',
      description: 'Explore real-time marine data on interactive 3D globe',
      icon: <Globe className="h-6 w-6" />,
      path: '/dashboard/marine-map',
      color: 'text-blue-600 dark:text-blue-400 ocean:text-cyan-300',
      accent: 'bg-blue-100 dark:bg-blue-900/30 ocean:bg-cyan-500/20',
      border: 'border-blue-200 dark:border-blue-800 ocean:border-cyan-400/30'
    },
    {
      title: 'Real-time Analytics',
      description: 'View live marine data streams and analytics',
      icon: <Activity className="h-6 w-6" />,
      path: '/dashboard/analytics',
      color: 'text-green-600 dark:text-green-400 ocean:text-emerald-300',
      accent: 'bg-green-100 dark:bg-green-900/30 ocean:bg-emerald-500/20',
      border: 'border-green-200 dark:border-green-800 ocean:border-emerald-400/30'
    },
    {
      title: 'Species Explorer',
      description: 'Browse and search marine species database',
      icon: <Eye className="h-6 w-6" />,
      path: '/dashboard/species',
      color: 'text-purple-600 dark:text-purple-400 ocean:text-indigo-300',
      accent: 'bg-purple-100 dark:bg-purple-900/30 ocean:bg-indigo-500/20',
      border: 'border-purple-200 dark:border-purple-800 ocean:border-indigo-400/30'
    },
    {
      title: 'Community Hub',
      description: 'Connect with marine researchers worldwide',
      icon: <Users className="h-6 w-6" />,
      path: '/dashboard/community',
      color: 'text-orange-600 dark:text-orange-400 ocean:text-amber-300',
      accent: 'bg-orange-100 dark:bg-orange-900/30 ocean:bg-amber-500/20',
      border: 'border-orange-200 dark:border-orange-800 ocean:border-amber-400/30'
    }
  ];

  const handleCategorySelect = (path: string) => {
    navigate(path);
  };

  return (
    <div className={`min-h-screen relative ${
      theme === 'ocean' 
        ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900' 
        : 'bg-gray-50 dark:bg-gray-900'
    }`}>
      {/* Ocean Theme Overlay Effects */}
      {theme === 'ocean' && (
        <>
          {/* Heavily Blurred Ocean Background */}
          <div className="fixed inset-0 ocean-background-blur pointer-events-none z-0"></div>
          
          {/* Subtle Wave Animation Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
            <div className="wave-animation absolute inset-0"></div>
          </div>
          
          {/* Floating marine elements - subtle and non-intrusive */}
          <div className="absolute top-20 left-10 opacity-20 animate-pulse pointer-events-none z-0">
            <Anchor className="h-12 w-12 text-blue-300" />
          </div>
          <div className="absolute top-40 right-20 opacity-15 animate-bounce pointer-events-none z-0">
            <Shell className="h-8 w-8 text-cyan-300" />
          </div>
          <div className="absolute bottom-20 left-1/4 opacity-15 animate-pulse pointer-events-none z-0">
            <Fish className="h-10 w-10 text-teal-300" />
          </div>
          <div className="absolute top-60 right-1/4 opacity-20 animate-pulse pointer-events-none z-0">
            <Waves className="h-14 w-14 text-blue-300" />
          </div>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with Theme Awareness */}
        {/* Header with Theme Awareness */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Microscope className={`h-16 w-16 mr-4 ${
                theme === 'ocean' 
                  ? 'text-cyan-300 animate-pulse' 
                  : 'text-blue-600 dark:text-blue-400'
              }`} />
              <div className="absolute -top-2 -right-2">
                <Zap className={`h-6 w-6 ${
                  theme === 'ocean' 
                    ? 'text-yellow-400 animate-ping' 
                    : 'text-yellow-500 dark:text-yellow-400'
                }`} />
              </div>
            </div>
            <h1 className={`text-5xl font-bold tracking-wide ${
              theme === 'ocean' 
                ? 'text-white' 
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              Marine Research Hub
            </h1>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className={`text-2xl mb-4 font-light ${
              theme === 'ocean' 
                ? 'text-cyan-100' 
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              Dive Deep into Marine Science Discovery
            </p>
            <p className={`text-lg ${
              theme === 'ocean' 
                ? 'text-blue-200 opacity-90' 
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              Choose your research pathway and access advanced tools for comprehensive marine research
            </p>
          </div>
        </div>

        {/* Research Categories with Enhanced Ocean Theme Visibility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {researchCategories.map((category) => (
            <Card 
              key={category.id} 
              className={`group hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 hover:scale-105 ${
                theme === 'ocean' 
                  ? 'hover:border-cyan-400 dark:hover:border-cyan-500 backdrop-blur-sm bg-white/40 hover:bg-white/50 border-white/30 shadow-lg hover:shadow-cyan-500/25' 
                  : 'hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'
              } ${category.bgPattern}`}
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
                    <ChevronRight className={`h-6 w-6 transition-all duration-300 group-hover:translate-x-1 ${
                      theme === 'ocean' 
                        ? 'text-white group-hover:text-cyan-200 drop-shadow-lg' 
                        : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400'
                    }`} />
                  </div>
                </div>
                <CardTitle className={`text-2xl font-semibold transition-colors duration-300 ${
                  theme === 'ocean' 
                    ? 'text-white group-hover:text-cyan-200 drop-shadow-lg' 
                    : 'text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                }`}>
                  {category.title}
                </CardTitle>
                <CardDescription className={`text-base leading-relaxed ${
                  theme === 'ocean' 
                    ? 'text-cyan-50 drop-shadow-md' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className={`font-medium ${
                    theme === 'ocean' 
                      ? 'text-cyan-100 drop-shadow-md' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>Key Features:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {category.features.map((feature, index) => (
                      <div key={index} className={`flex items-center transition-colors duration-300 ${
                        theme === 'ocean' 
                          ? 'text-white group-hover:text-cyan-100 drop-shadow-sm' 
                          : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'
                      }`}>
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
        <Card className={`mb-8 backdrop-blur-sm ${
          theme === 'ocean' 
            ? 'bg-white/25 border-white/20' 
            : 'bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700'
        } shadow-2xl`}>
          <CardHeader>
            <CardTitle className={`flex items-center text-2xl ${
              theme === 'ocean' 
                ? 'text-white' 
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              <Map className={`h-8 w-8 mr-3 ${
                theme === 'ocean' 
                  ? 'text-cyan-400' 
                  : 'text-blue-600 dark:text-blue-400'
              }`} />
              Quick Access Tools
              <Waves className={`h-6 w-6 ml-3 animate-pulse ${
                theme === 'ocean' 
                  ? 'text-cyan-300' 
                  : 'text-blue-500 dark:text-blue-400'
              }`} />
            </CardTitle>
            <CardDescription className={`text-lg ${
              theme === 'ocean' 
                ? 'text-cyan-100' 
                : 'text-gray-600 dark:text-gray-300'
            }`}>
              Frequently used research tools and marine resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`h-auto p-6 flex flex-col items-start space-y-3 hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                    theme === 'ocean'
                      ? 'bg-white/20 hover:bg-white/30 border-white/20 hover:border-cyan-400 text-white hover:text-cyan-100'
                      : 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  onClick={() => navigate(action.path)}
                >
                  <div className={`p-3 rounded-lg ${action.accent} transition-colors duration-300`}>
                    <div className={action.color}>
                      {action.icon}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-lg">{action.title}</div>
                    <div className={`text-sm mt-1 leading-relaxed ${
                      theme === 'ocean' 
                        ? 'text-cyan-200' 
                        : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {action.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Getting Started with Ocean Theme */}
        <Card className={`backdrop-blur-sm shadow-2xl ${
          theme === 'ocean' 
            ? 'bg-white/25 border-white/20' 
            : 'bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700'
        }`}>
          <CardHeader>
            <CardTitle className={`flex items-center text-2xl ${
              theme === 'ocean' 
                ? 'text-white' 
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              <BookOpen className={`h-8 w-8 mr-3 ${
                theme === 'ocean' 
                  ? 'text-cyan-400' 
                  : 'text-blue-600 dark:text-blue-400'
              }`} />
              Dive Into Marine Research
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`space-y-3 p-6 rounded-lg border transition-all duration-300 ${
                theme === 'ocean'
                  ? 'bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border-cyan-400/40'
                  : 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-200 dark:border-blue-700'
              }`}>
                <h4 className={`font-semibold text-xl ${
                  theme === 'ocean' 
                    ? 'text-white' 
                    : 'text-gray-900 dark:text-gray-100'
                }`}>New to Marine Research?</h4>
                <p className={`leading-relaxed ${
                  theme === 'ocean' 
                    ? 'text-cyan-100' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Start with our guided tutorials and sample datasets to learn the platform.
                </p>
                <Button 
                  variant="link" 
                  className={`p-0 h-auto font-medium ${
                    theme === 'ocean' 
                      ? 'text-cyan-300 hover:text-cyan-200' 
                      : 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
                  }`}
                  onClick={() => navigate('/dashboard/education')}
                >
                  View Tutorials →
                </Button>
              </div>
              <div className={`space-y-3 p-6 rounded-lg border transition-all duration-300 ${
                theme === 'ocean'
                  ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-green-400/40'
                  : 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-700'
              }`}>
                <h4 className={`font-semibold text-xl ${
                  theme === 'ocean' 
                    ? 'text-white' 
                    : 'text-gray-900 dark:text-gray-100'
                }`}>Need Help?</h4>
                <p className={`leading-relaxed ${
                  theme === 'ocean' 
                    ? 'text-green-100' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Access documentation, API references, and community support.
                </p>
                <Button 
                  variant="link" 
                  className={`p-0 h-auto font-medium ${
                    theme === 'ocean' 
                      ? 'text-green-300 hover:text-green-200' 
                      : 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
                  }`}
                  onClick={() => navigate('/dashboard/api-docs')}
                >
                  Get Support →
                </Button>
              </div>
              <div className={`space-y-3 p-6 rounded-lg border transition-all duration-300 ${
                theme === 'ocean'
                  ? 'bg-gradient-to-br from-purple-500/30 to-indigo-500/30 border-purple-400/40'
                  : 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 border-purple-200 dark:border-purple-700'
              }`}>
                <h4 className={`font-semibold text-xl ${
                  theme === 'ocean' 
                    ? 'text-white' 
                    : 'text-gray-900 dark:text-gray-100'
                }`}>Share Your Research</h4>
                <p className={`leading-relaxed ${
                  theme === 'ocean' 
                    ? 'text-purple-100' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Publish findings and collaborate with the global marine research community.
                </p>
                <Button 
                  variant="link" 
                  className={`p-0 h-auto font-medium ${
                    theme === 'ocean' 
                      ? 'text-purple-300 hover:text-purple-200' 
                      : 'text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300'
                  }`}
                  onClick={() => navigate('/dashboard/research-publishing')}
                >
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