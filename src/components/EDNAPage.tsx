import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Dna, 
  Search, 
  Database, 
  Upload,
  Microscope,
  BarChart3,
  FileText,
  Zap,
  Globe,
  TestTube
} from "lucide-react";

const EDNAPage = () => {
  const [searchSequence, setSearchSequence] = useState("");

  const eDNASamples = [
    {
      id: "eDNA-001",
      location: "Arabian Sea - Station A12",
      date: "2024-01-15",
      species_detected: 47,
      sequences: 342,
      status: "processed",
      diversity_index: 3.24
    },
    {
      id: "eDNA-002", 
      location: "Red Sea - Coral Reef Zone",
      date: "2024-01-18",
      species_detected: 62,
      sequences: 428,
      status: "processing",
      diversity_index: 3.89
    },
    {
      id: "eDNA-003",
      location: "Indian Ocean - Deep Waters",
      date: "2024-01-20",
      species_detected: 23,
      sequences: 156,
      status: "queued",
      diversity_index: 2.67
    }
  ];

  const sequenceTypes = [
    { type: "COI (Cytochrome c oxidase I)", purpose: "Species identification", count: "12,456" },
    { type: "16S rRNA", purpose: "Phylogenetic analysis", count: "8,932" },
    { type: "18S rRNA", purpose: "Eukaryotic diversity", count: "6,744" },
    { type: "12S rRNA", purpose: "Fish barcoding", count: "4,223" },
  ];

  const analysisTools = [
    {
      name: "BLAST Search",
      description: "Compare sequences against global databases",
      icon: Search,
      database: "NCBI GenBank"
    },
    {
      name: "Phylogenetic Analysis",
      description: "Build evolutionary trees and relationships",
      icon: BarChart3,
      database: "Custom Pipeline"
    },
    {
      name: "Metabarcoding",
      description: "Community analysis from bulk samples",
      icon: Microscope,
      database: "BOLD Systems"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">eDNA & Molecular Analysis</h1>
        <p className="text-muted-foreground">Environmental DNA sequencing, storage, and species matching platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sequences</CardTitle>
            <Dna className="h-4 w-4 text-ocean" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32,355</div>
            <p className="text-xs text-muted-foreground">+1,247 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Species Identified</CardTitle>
            <TestTube className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,842</div>
            <p className="text-xs text-muted-foreground">97.3% match confidence</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Samples</CardTitle>
            <Microscope className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">12 processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Size</CardTitle>
            <Database className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4TB</div>
            <p className="text-xs text-muted-foreground">Sequence data</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="samples" className="space-y-4">
        <TabsList>
          <TabsTrigger value="samples">Sample Management</TabsTrigger>
          <TabsTrigger value="sequences">Sequence Database</TabsTrigger>
          <TabsTrigger value="analysis">Analysis Tools</TabsTrigger>
          <TabsTrigger value="matching">Species Matching</TabsTrigger>
        </TabsList>

        <TabsContent value="samples" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upload eDNA Sample</CardTitle>
                  <CardDescription>Upload sequencing data for environmental DNA analysis</CardDescription>
                </div>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  New Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Dna className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drop FASTQ/FASTA files here (.fastq, .fasta, .gz)
                </p>
                <Button variant="outline">Browse Files</Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {eDNASamples.map((sample, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{sample.id}</CardTitle>
                      <CardDescription>{sample.location}</CardDescription>
                    </div>
                    <Badge variant={
                      sample.status === 'processed' ? 'secondary' :
                      sample.status === 'processing' ? 'default' : 'outline'
                    }>
                      {sample.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Species Detected</p>
                      <p className="font-semibold text-ocean">{sample.species_detected}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Sequences</p>
                      <p className="font-semibold">{sample.sequences}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Diversity Index</p>
                      <p className="font-semibold text-accent">{sample.diversity_index}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-semibold">{sample.date}</p>
                    </div>
                  </div>
                  
                  {sample.status === 'processing' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Processing...</span>
                        <span>67%</span>
                      </div>
                      <Progress value={67} />
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Globe className="w-4 h-4 mr-2" />
                      View Map
                    </Button>
                    <Button size="sm" variant="outline">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analysis
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sequences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sequence Search</CardTitle>
              <CardDescription>Search molecular sequences in the database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Enter DNA sequence (ATCG format) or accession number..."
                    value={searchSequence}
                    onChange={(e) => setSearchSequence(e.target.value)}
                    className="font-mono"
                  />
                  <Button>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Example: ATCGATCGATCG or GenBank accession: MN908947
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {sequenceTypes.map((seqType, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{seqType.type}</CardTitle>
                      <CardDescription>{seqType.purpose}</CardDescription>
                    </div>
                    <Badge variant="secondary">{seqType.count} sequences</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Database className="w-4 h-4 mr-2" />
                    Browse Sequences
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {analysisTools.map((tool, index) => (
              <Card key={index} className="hover:shadow-wave transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <tool.icon className="h-6 w-6 text-ocean" />
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                  </div>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Database: </span>
                      <span className="font-medium">{tool.database}</span>
                    </div>
                    <Button className="w-full">
                      <Zap className="w-4 h-4 mr-2" />
                      Run Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Custom Pipeline</CardTitle>
              <CardDescription>Create custom analysis workflows for specialized research</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 flex flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  <span>Quality Control</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col">
                  <Search className="w-6 h-6 mb-2" />
                  <span>Taxonomy Assignment</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col">
                  <BarChart3 className="w-6 h-6 mb-2" />
                  <span>Community Analysis</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col">
                  <Globe className="w-6 h-6 mb-2" />
                  <span>Biogeographic Mapping</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matching" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Species Matching Results</CardTitle>
              <CardDescription>Recent eDNA species identification matches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium italic">Epinephelus marginatus</span>
                    <Badge variant="secondary">99.2% match</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    COI sequence • 658 bp • Sample: eDNA-001
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium italic">Thunnus albacares</span>
                    <Badge variant="secondary">97.8% match</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    16S rRNA sequence • 550 bp • Sample: eDNA-002
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium italic">Serranus scriba</span>
                    <Badge variant="outline">89.4% match</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    COI sequence • 620 bp • Sample: eDNA-003 • Requires verification
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EDNAPage;