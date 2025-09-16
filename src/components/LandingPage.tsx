import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Waves, TrendingUp, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-ocean.jpg";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const LandingPage = () => {
  const features = [
    {
      icon: Waves,
      title: "Marine Data Analysis",
      description: "Advanced analytics for ocean and marine ecosystem data"
    },
    {
      icon: TrendingUp,
      title: "Real-time Insights",
      description: "Live visualizations and trend analysis for marine research"
    },
    {
      icon: Users,
      title: "Multi-user Platform",
      description: "Tailored experiences for researchers, policymakers, and enthusiasts"
    },
    {
      icon: Zap,
      title: "AI-Powered",
      description: "Intelligent chatbot and automated pattern recognition"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Waves className="h-8 w-8 text-ocean" />
            <h1 className="text-2xl font-bold text-primary">MATSYA</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            <Link to="/auth">
              <Button variant="outline" className="border-ocean text-ocean hover:bg-ocean hover:text-ocean-foreground">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div 
            className="relative rounded-3xl overflow-hidden mb-12 shadow-ocean"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '400px'
            }}
          >
            <div className="absolute inset-0 bg-gradient-ocean/70 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  Dive Deep into
                  <span className="block text-primary-glow">Marine Insights</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
                  Advanced marine data analysis platform for researchers, policymakers, and ocean enthusiasts
                </p>
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-coral hover:opacity-90 text-white font-semibold px-8 py-4 text-lg shadow-wave">
                    Explore the Ocean
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary">
            Powerful Marine Analytics
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-wave transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-ocean" />
                  <h3 className="text-xl font-semibold mb-3 text-primary">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-ocean">
        <div className="container mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Explore?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join researchers and policymakers using MATSYA for cutting-edge marine data analysis
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 bg-card">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 MATSYA. Advancing marine science through data.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;