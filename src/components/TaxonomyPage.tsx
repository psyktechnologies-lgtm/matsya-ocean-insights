import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  TreePine, 
  Camera, 
  Microscope, 
  Dna,
  Star,
  Book,
  Globe,
  Upload,
  Database,
  CheckCircle
} from "lucide-react";

const TaxonomyPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const taxonomicGroups = [
    { kingdom: "Animalia", phylum: "Chordata", class: "Actinopterygii", count: 32567 },
    { kingdom: "Animalia", phylum: "Mollusca", class: "Gastropoda", count: 18432 },
    { kingdom: "Animalia", phylum: "Arthropoda", class: "Malacostraca", count: 14892 },
    { kingdom: "Plantae", phylum: "Ochrophyta", class: "Phaeophyceae", count: 8765 },
  ];

  const recentIdentifications = [
    {
      species: "Thunnus albacares",
      commonName: "Yellowfin Tuna",
      confidence: 97.8,
      method: "AI Classification",
      location: "Indian Ocean"
    },
    {
      species: "Sepioteuthis lessoniana",
      commonName: "Bigfin Reef Squid", 
      confidence: 94.2,
      method: "Morphological",
      location: "Arabian Sea"
    },
    {
      species: "Epinephelus marginatus",
      commonName: "Dusky Grouper",
      confidence: 89.1,
      method: "DNA Barcoding",
      location: "Red Sea"
    }
  ];

  const classificationTools = [
    {
      name: "AI Visual Classifier",
      description: "Upload images for automated species identification",
      icon: Camera,
      accuracy: "94.5%"
    },
    {
      name: "Morphometric Analysis", 
      description: "Detailed morphological measurements and classification",
      icon: Microscope,
      accuracy: "91.2%"
    },
    {
      name: "DNA Barcoding",
      description: "Molecular identification using genetic sequences",
      icon: Dna,
      accuracy: "99.1%"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Taxonomy & Classification</h1>
        <p className="text-muted-foreground">Comprehensive taxonomic database and species identification tools</p>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search species, taxonomy, or common names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse">Browse Taxonomy</TabsTrigger>
          <TabsTrigger value="identify">Species Identification</TabsTrigger>
          <TabsTrigger value="upload">Upload Data</TabsTrigger>
          <TabsTrigger value="recent">Recent Classifications</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <div className="grid gap-4">
            {taxonomicGroups.map((group, index) => (
              <Card key={index} className="hover:shadow-wave transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TreePine className="h-5 w-5 text-ocean" />
                      <CardTitle className="text-lg">
                        {group.class}
                      </CardTitle>
                    </div>
                    <Badge variant="secondary">{group.count.toLocaleString()} species</Badge>
                  </div>
                  <CardDescription>
                    {group.kingdom} → {group.phylum} → {group.class}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Globe className="w-4 h-4 mr-2" />
                      View Distribution
                    </Button>
                    <Button size="sm" variant="outline">
                      <Book className="w-4 h-4 mr-2" />
                      Browse Species
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="identify" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {classificationTools.map((tool, index) => (
              <Card key={index} className="hover:shadow-wave transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <tool.icon className="h-6 w-6 text-ocean" />
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                  </div>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Accuracy</span>
                    <Badge variant="secondary">{tool.accuracy}</Badge>
                  </div>
                  <Button className="w-full">
                    Start Identification
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Upload</CardTitle>
              <CardDescription>Upload specimen images for automated identification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Camera className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drop specimen images here for AI classification
                </p>
                <Button>Upload Images</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-ocean" />
                  Upload Taxonomy Database
                </CardTitle>
                <CardDescription>
                  Upload taxonomic datasets in various formats (Darwin Core, CSV, Excel, JSON)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dataset Name</label>
                  <Input placeholder="e.g., WoRMS Marine Taxa 2024" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Format</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="darwin_core">Darwin Core</option>
                    <option value="csv">CSV</option>
                    <option value="tsv">TSV</option>
                    <option value="json">JSON</option>
                    <option value="excel">Excel (.xlsx)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Source</label>
                  <Input placeholder="e.g., FishBase, WoRMS, GBIF" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea 
                    className="w-full p-2 border rounded-md h-20 resize-none"
                    placeholder="Brief description of the taxonomic dataset..."
                  />
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drop your taxonomy file here or click to browse
                  </p>
                  <p className="text-xs text-gray-500">
                    Supported: .csv, .tsv, .xlsx, .json, .dwc, .xml (max 500MB)
                  </p>
                  <Button className="mt-3">
                    Select File
                  </Button>
                </div>
                
                <Button className="w-full bg-ocean hover:bg-ocean/90">
                  Upload Taxonomy Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-ocean" />
                  Supported Formats
                </CardTitle>
                <CardDescription>
                  Compatible data formats for taxonomy uploads
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Darwin Core</p>
                      <p className="text-sm text-gray-600">Standard biodiversity data format</p>
                    </div>
                    <Badge variant="secondary">Recommended</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">CSV/TSV</p>
                      <p className="text-sm text-gray-600">Comma or tab separated values</p>
                    </div>
                    <Badge variant="outline">Popular</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Excel (.xlsx)</p>
                      <p className="text-sm text-gray-600">Microsoft Excel spreadsheets</p>
                    </div>
                    <Badge variant="outline">Common</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">JSON</p>
                      <p className="text-sm text-gray-600">Structured data format</p>
                    </div>
                    <Badge variant="outline">API Ready</Badge>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">Required Fields:</p>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Scientific Name</li>
                    <li>• Kingdom, Phylum, Class</li>
                    <li>• Family, Genus, Species</li>
                    <li>• Conservation Status (optional)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
              <CardDescription>Recently uploaded taxonomy datasets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">WoRMS Marine Taxa 2024</p>
                      <p className="text-sm text-gray-600">245,892 records • Darwin Core</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">2 hours ago</p>
                    <Badge variant="secondary">Processing</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Database className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">FishBase Taxonomy</p>
                      <p className="text-sm text-gray-600">34,567 records • CSV</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">1 day ago</p>
                    <Badge>Complete</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          {recentIdentifications.map((identification, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg italic">{identification.species}</CardTitle>
                    <CardDescription>{identification.commonName}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">{identification.confidence}%</span>
                    </div>
                    <Badge variant="outline">{identification.method}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Location: {identification.location}</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline">Export</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Species</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-ocean">74,656</div>
                <p className="text-sm text-muted-foreground">Across all marine taxa</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Classifications Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">1,247</div>
                <p className="text-sm text-muted-foreground">+15% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">92.3%</div>
                <p className="text-sm text-muted-foreground">AI classification accuracy</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxonomyPage;