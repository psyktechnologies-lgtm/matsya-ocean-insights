import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  MessageCircle, 
  BookOpen, 
  TrendingUp, 
  Users, 
  Waves,
  Crown,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";

interface UserProfile {
  fullName: string;
  userType: string;
  organization?: string;
  bio?: string;
}

const Dashboard = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('matsya_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const isAdvancedUser = profile?.userType === "researcher" || profile?.userType === "policymaker";

  const basicFeatures = [
    {
      title: "AI Marine Chatbot",
      description: "Ask questions about marine ecosystems, species, and conservation",
      icon: MessageCircle,
      link: "/dashboard/chatbot",
      color: "text-blue-600"
    },
    {
      title: "Basic Analytics",
      description: "View fundamental marine data trends and statistics",
      icon: BarChart3,
      link: "/dashboard/analytics", 
      color: "text-green-600"
    },
    {
      title: "Educational Resources",
      description: "Learn about marine biology, conservation, and ocean science",
      icon: BookOpen,
      link: "/dashboard/education",
      color: "text-purple-600"
    }
  ];

  const advancedFeatures = [
    {
      title: "Real-time Visualizations",
      description: "Live marine data streams and interactive maps",
      icon: TrendingUp,
      link: "/dashboard/realtime",
      color: "text-ocean"
    },
    {
      title: "Premium Analytics",
      description: "Advanced research tools and deep-dive analysis",
      icon: Crown,
      link: "/dashboard/premium",
      color: "text-accent"
    }
  ];

  const mockStats = [
    { label: "Marine Species Tracked", value: "12,450", change: "+5.2%" },
    { label: "Research Papers", value: "8,234", change: "+12.1%" },
    { label: "Ocean Zones Monitored", value: "156", change: "+3.8%" },
    { label: "Active Researchers", value: "2,847", change: "+8.7%" },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Welcome back, {profile?.fullName || "Ocean Explorer"}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdvancedUser 
              ? "Access your advanced marine research tools and analytics"
              : "Discover the wonders of marine science and conservation"
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Waves className="h-8 w-8 text-ocean" />
          {profile && (
            <Badge variant={isAdvancedUser ? "default" : "secondary"} className="text-xs">
              {profile.userType === "researcher" ? "Researcher" : 
               profile.userType === "policymaker" ? "Policy Maker" : "Enthusiast"}
            </Badge>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-wave transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <Activity className="h-4 w-4 text-ocean" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {basicFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-wave transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={feature.link}>
                <Button className="w-full" variant="outline">
                  Explore
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}

        {isAdvancedUser && advancedFeatures.map((feature, index) => (
          <Card key={`advanced-${index}`} className="hover:shadow-wave transition-all duration-300 hover:-translate-y-1 border-accent/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span>{feature.title}</span>
                  <Badge variant="default" className="bg-accent text-accent-foreground text-xs">
                    Premium
                  </Badge>
                </CardTitle>
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={feature.link}>
                <Button className="w-full bg-gradient-coral hover:opacity-90">
                  Access Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-subtle">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Waves className="h-5 w-5 text-ocean" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>
            Get started with the most popular features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/dashboard/chatbot">
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="mr-2 h-4 w-4" />
                Ask AI about marine life
              </Button>
            </Link>
            <Link to="/dashboard/analytics">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                View ocean statistics
              </Button>
            </Link>
            <Link to="/dashboard/education">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Learn marine science
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* User Type Upgrade Banner for Normal Users */}
      {!isAdvancedUser && (
        <Card className="bg-gradient-ocean text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="h-5 w-5" />
              <span>Unlock Advanced Features</span>
            </CardTitle>
            <CardDescription className="text-blue-100">
              Get access to real-time data, advanced analytics, and research tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm opacity-90">Become a verified researcher or policy maker</p>
                <div className="flex space-x-2">
                  <Badge variant="secondary" className="bg-white/20 text-white">Real-time Data</Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">Advanced Analytics</Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">Research Tools</Badge>
                </div>
              </div>
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;