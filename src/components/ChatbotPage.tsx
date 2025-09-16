import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your marine science assistant. Ask me anything about ocean life, marine ecosystems, conservation efforts, or marine research!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sampleResponses = [
    "Marine biodiversity is incredibly rich, with over 250,000 known species in our oceans. Many species remain undiscovered in the deep sea regions.",
    "Ocean acidification is a major concern caused by increased CO2 absorption. It affects coral reefs and shellfish, disrupting marine food chains.",
    "Whale migration patterns are fascinating! Blue whales can travel up to 12,000 miles annually, following food sources and breeding grounds.",
    "Coral bleaching occurs when corals expel their symbiotic algae due to stress, often from rising temperatures. It's a critical conservation issue.",
    "The Mariana Trench is the deepest part of our oceans at nearly 36,000 feet deep. It hosts unique species adapted to extreme pressure and darkness.",
    "Marine protected areas are essential for conservation. They help restore fish populations and protect critical habitats from human impact."
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: sampleResponses[Math.floor(Math.random() * sampleResponses.length)],
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "What are the main threats to coral reefs?",
    "How do whales communicate?",
    "What is ocean acidification?",
    "Tell me about deep sea creatures",
    "How can we protect marine ecosystems?"
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary flex items-center space-x-2">
          <MessageCircle className="h-8 w-8 text-ocean" />
          <span>Marine AI Assistant</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Ask questions about marine life, ocean science, and conservation efforts
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-ocean" />
                <span>Chat with Marine AI</span>
              </CardTitle>
              <CardDescription>
                Get instant answers about marine science and ocean conservation
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex space-x-3 ${message.isBot ? '' : 'justify-end'}`}>
                      {message.isBot && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-ocean text-ocean-foreground">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.isBot 
                          ? 'bg-muted text-foreground' 
                          : 'bg-ocean text-ocean-foreground ml-auto'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      
                      {!message.isBot && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  
                  {loading && (
                    <div className="flex space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-ocean text-ocean-foreground">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-ocean rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-ocean rounded-full animate-pulse delay-100"></div>
                          <div className="w-2 h-2 bg-ocean rounded-full animate-pulse delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="flex space-x-2 mt-4">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about marine life, conservation, research..."
                  className="flex-1"
                  disabled={loading}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={loading || !inputMessage.trim()}
                  className="bg-ocean hover:bg-ocean/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Questions Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Questions</CardTitle>
              <CardDescription>
                Click to ask common marine science questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-3 whitespace-normal"
                  onClick={() => setInputMessage(question)}
                  disabled={loading}
                >
                  {question}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Marine species identification</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Conservation strategies</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Ocean science explanations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Research paper insights</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;