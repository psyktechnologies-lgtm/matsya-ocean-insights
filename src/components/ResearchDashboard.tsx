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
  Globe
} from 'lucide-react';

const ResearchDashboard: React.FC = () => {
  const navigate = useNavigate();

  const researchCategories = [
    {
      id: 'taxonomy',
      title: 'Taxonomy Research',
      description: 'Upload and analyze taxonomic datasets, species classification, and biodiversity studies',
      icon: <Database className="h-8 w-8" />,
      color: 'bg-blue-500',
      path: '/taxonomy',
      features: ['Darwin Core Support', 'Species Classification', 'Biodiversity Analysis', 'Data Validation'],
      status: 'Active'
    },
    {
      id: 'otolith',
      title: 'Otolith Analysis',
      description: 'Fish age determination and growth analysis through otolith structure examination',
      icon: <Fish className="h-8 w-8" />,
      color: 'bg-green-500',
      path: '/otolith',
      features: ['Age Determination', 'Growth Analysis', 'Image Processing', 'Statistical Models'],
      status: 'Active'
    },
    {
      id: 'edna',
      title: 'eDNA Analysis',
      description: 'Environmental DNA sequencing, metabarcoding, and species detection from water samples',
      icon: <Dna className="h-8 w-8" />,
      color: 'bg-purple-500',
      path: '/edna',
      features: ['Sequence Analysis', 'Metabarcoding', 'Species Detection', 'Quality Control'],
      status: 'Active'
    },
    {
      id: 'research-paper',
      title: 'Research Publishing',
      description: 'Submit, collaborate, and publish marine research papers with peer review system',
      icon: <FileText className="h-8 w-8" />,
      color: 'bg-orange-500',
      path: '/research-publishing',
      features: ['Manuscript Submission', 'Peer Review', 'Collaboration Tools', 'Publication Management'],
      status: 'New'
    }
  ];

  const quickActions = [
    {
      title: '3D Marine Map',
      description: 'Explore real-time marine data on interactive 3D globe',
      icon: <Globe className="h-6 w-6" />,
      path: '/marine-map',
      color: 'text-blue-600'
    },
    {
      title: 'Real-time Analytics',
      description: 'View live marine data streams and analytics',
      icon: <Activity className="h-6 w-6" />,
      path: '/analytics',
      color: 'text-green-600'
    },
    {
      title: 'Species Explorer',
      description: 'Browse and search marine species database',
      icon: <Eye className="h-6 w-6" />,
      path: '/species',
      color: 'text-purple-600'
    },
    {
      title: 'Community Hub',
      description: 'Connect with marine researchers worldwide',
      icon: <Users className="h-6 w-6" />,
      path: '/community',
      color: 'text-orange-600'
    }
  ];

  const handleCategorySelect = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-blue-900 dark:to-teal-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Microscope className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Marine Research Hub
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choose your research pathway and access advanced tools for marine science discovery
          </p>
        </div>

        {/* Research Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {researchCategories.map((category) => (
            <Card 
              key={category.id} 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-300 dark:hover:border-blue-600"
              onClick={() => handleCategorySelect(category.path)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${category.color} text-white`}>
                    {category.icon}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={category.status === 'New' ? 'default' : 'secondary'}>
                      {category.status}
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
                <CardTitle className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                  {category.title}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Key Features:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {category.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Map className="h-6 w-6 mr-2" />
              Quick Access Tools
            </CardTitle>
            <CardDescription>
              Frequently used research tools and resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-all"
                  onClick={() => navigate(action.path)}
                >
                  <div className={`${action.color}`}>
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {action.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-6 w-6 mr-2" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">New to Marine Research?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start with our guided tutorials and sample datasets to learn the platform.
                </p>
                <Button variant="link" className="p-0 h-auto">
                  View Tutorials →
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Need Help?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Access documentation, API references, and community support.
                </p>
                <Button variant="link" className="p-0 h-auto">
                  Get Support →
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Share Your Research</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Publish findings and collaborate with the global marine research community.
                </p>
                <Button variant="link" className="p-0 h-auto">
                  Learn More →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResearchDashboard;