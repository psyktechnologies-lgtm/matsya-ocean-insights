import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, TrendingDown, Fish, Waves, Thermometer } from "lucide-react";

const AnalyticsPage = () => {
  const oceanStats = [
    {
      title: "Ocean Temperature",
      value: "15.2°C",
      change: "+0.8°C",
      trend: "up",
      description: "Global average sea surface temperature",
      icon: Thermometer,
      color: "text-red-600"
    },
    {
      title: "Marine Species Count",
      value: "245,120",
      change: "+2,450",
      trend: "up", 
      description: "Known marine species documented",
      icon: Fish,
      color: "text-blue-600"
    },
    {
      title: "Ocean pH Level",
      value: "8.04",
      change: "-0.02",
      trend: "down",
      description: "Global ocean acidity level",
      icon: Waves,
      color: "text-orange-600"
    }
  ];

  const conservationData = [
    { region: "Coral Triangle", protection: 85, species: "3,200+", status: "Critical" },
    { region: "Great Barrier Reef", protection: 73, species: "1,800+", status: "Vulnerable" },
    { region: "Galápagos Islands", protection: 96, species: "2,900+", status: "Protected" },
    { region: "Mediterranean Sea", protection: 41, species: "12,000+", status: "Threatened" },
    { region: "Arctic Ocean", protection: 28, species: "5,500+", status: "Declining" }
  ];

  const researchMetrics = [
    { category: "Published Papers", count: 8234, growth: "+12%" },
    { category: "Active Research Sites", count: 1567, growth: "+8%" },
    { category: "Collaborative Projects", count: 445, growth: "+15%" },
    { category: "Data Collection Points", count: 23678, growth: "+22%" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Protected": return "bg-green-100 text-green-800";
      case "Vulnerable": return "bg-yellow-100 text-yellow-800";
      case "Critical": return "bg-red-100 text-red-800";
      case "Threatened": return "bg-orange-100 text-orange-800";
      case "Declining": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary flex items-center space-x-2">
          <BarChart3 className="h-8 w-8 text-ocean" />
          <span>Marine Analytics</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Explore key metrics and trends in marine science and ocean conservation
        </p>
      </div>

      {/* Key Ocean Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        {oceanStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-wave transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>
                <span>from last year</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conservation Status by Region */}
      <Card>
        <CardHeader>
          <CardTitle>Marine Conservation by Region</CardTitle>
          <CardDescription>
            Protection levels and biodiversity across major marine regions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {conservationData.map((region, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">{region.region}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {region.species} species
                      </span>
                      <Badge variant="outline" className={getStatusColor(region.status)}>
                        {region.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{region.protection}%</div>
                    <div className="text-xs text-muted-foreground">Protected</div>
                  </div>
                </div>
                <Progress value={region.protection} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Research Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {researchMetrics.map((metric, index) => (
          <Card key={index} className="text-center hover:shadow-wave transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{metric.count.toLocaleString()}</div>
              <div className="text-xs text-green-600 font-medium mt-1">
                {metric.growth} this year
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ocean Temperature Trends</CardTitle>
            <CardDescription>Global sea surface temperature over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-subtle rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Interactive temperature chart</p>
                <p className="text-xs">(Chart visualization would appear here)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Species Discovery Rate</CardTitle>
            <CardDescription>New marine species discovered annually</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-subtle rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Fish className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Species discovery timeline</p>
                <p className="text-xs">(Chart visualization would appear here)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Sources */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Data Sources & Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Temperature Data</h4>
              <p className="text-muted-foreground">NOAA Global Ocean Temperature Analysis</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Species Database</h4>
              <p className="text-muted-foreground">World Register of Marine Species (WoRMS)</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Conservation Status</h4>
              <p className="text-muted-foreground">IUCN Red List & Marine Protected Areas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;