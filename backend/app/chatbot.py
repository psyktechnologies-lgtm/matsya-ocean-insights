"""
Marine Research AI Chatbot Integration
Specialized chatbot for marine biology and oceanography queries
"""

import openai
import asyncio
from typing import List, Dict, Optional
import json
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'backend', '.env')
load_dotenv(env_path)

# Optional Claude integration
try:
    import anthropic
    CLAUDE_AVAILABLE = True
except ImportError:
    CLAUDE_AVAILABLE = False

class MarineResearchChatbot:
    def __init__(self):
        # Initialize AI clients based on available API keys
        self.openai_client = None
        self.claude_client = None
        
        # Set up OpenAI if API key is available
        if os.getenv("OPENAI_API_KEY"):
            self.openai_client = openai.AsyncOpenAI(
                api_key=os.getenv("OPENAI_API_KEY")
            )
        
        # Set up Claude if API key is available and anthropic is installed
        if CLAUDE_AVAILABLE and os.getenv("ANTHROPIC_API_KEY"):
            self.claude_client = anthropic.Anthropic(
                api_key=os.getenv("ANTHROPIC_API_KEY")
            )
        
        # Determine which AI service to use
        self.ai_service = self._select_ai_service()
        
        # Marine research specialized system prompt
        self.system_prompt = """
        You are Matsya AI, an expert marine biology and oceanography assistant for the Matsya Ocean Insights platform. 
        
        Your expertise includes:
        - Marine biodiversity and taxonomy
        - Fish species identification and classification
        - Environmental DNA (eDNA) analysis
        - Oceanographic data interpretation
        - Marine conservation strategies
        - Fisheries science and management
        - Marine ecosystem dynamics
        - Climate change impacts on marine life
        - Taxonomic validation using Darwin Core standards
        - Research methodology and data analysis
        
        Always provide:
        - Scientifically accurate information
        - Relevant data sources and citations when possible
        - Practical applications for marine research
        - Suggestions for further analysis using platform tools
        
        Be conversational but professional, and relate responses to the user's marine research goals.
        """
        
        # Conversation history storage
        self.conversations: Dict[str, List[Dict]] = {}
    
    def _select_ai_service(self) -> str:
        """Select the best available AI service"""
        if self.openai_client:
            return "openai"
        elif self.claude_client:
            return "claude"
        else:
            return "fallback"
    
    async def chat(self, 
                   user_message: str, 
                   user_id: str = "default",
                   context: Optional[Dict] = None) -> Dict:
        """
        Main chat function with marine research context
        """
        try:
            # Initialize conversation history for new users
            if user_id not in self.conversations:
                self.conversations[user_id] = [
                    {"role": "system", "content": self.system_prompt}
                ]
            
            # Add context from platform data if provided
            enhanced_message = self._enhance_with_context(user_message, context)
            
            # Add user message to conversation history
            self.conversations[user_id].append({
                "role": "user", 
                "content": enhanced_message
            })
            
            # Get AI response based on available service
            if self.ai_service == "openai":
                response_data = await self._chat_openai(user_id)
            elif self.ai_service == "claude":
                response_data = await self._chat_claude(user_id)
            else:
                response_data = self._chat_fallback(user_message)
            
            # Add AI response to conversation history
            self.conversations[user_id].append({
                "role": "assistant",
                "content": response_data["response"]
            })
            
            return response_data
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "response": "I apologize, but I'm experiencing technical difficulties. Please try again later.",
                "timestamp": datetime.now().isoformat(),
                "ai_service": "error"
            }
    
    async def _chat_openai(self, user_id: str) -> Dict:
        """Handle OpenAI GPT chat"""
        response = await self.openai_client.chat.completions.create(
            model="gpt-4",  # or "gpt-3.5-turbo" for faster/cheaper responses
            messages=self.conversations[user_id][-10:],  # Keep last 10 messages for context
            max_tokens=1000,
            temperature=0.7,
            stream=False
        )
        
        ai_message = response.choices[0].message.content
        
        return {
            "success": True,
            "response": ai_message,
            "timestamp": datetime.now().isoformat(),
            "user_id": user_id,
            "tokens_used": response.usage.total_tokens,
            "model": "gpt-4",
            "ai_service": "openai",
            "suggestions": self._generate_suggestions(ai_message)
        }
    
    async def _chat_claude(self, user_id: str) -> Dict:
        """Handle Anthropic Claude chat"""
        # Convert conversation to Claude format
        messages = []
        for msg in self.conversations[user_id][-10:]:
            if msg["role"] != "system":  # Claude handles system prompt differently
                messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
        
        response = self.claude_client.messages.create(
            model="claude-3-haiku-20240307",  # or "claude-3-sonnet-20240229" for better quality
            max_tokens=1000,
            system=self.system_prompt,
            messages=messages
        )
        
        ai_message = response.content[0].text
        
        return {
            "success": True,
            "response": ai_message,
            "timestamp": datetime.now().isoformat(),
            "user_id": user_id,
            "tokens_used": response.usage.input_tokens + response.usage.output_tokens,
            "model": "claude-3-haiku",
            "ai_service": "claude",
            "suggestions": self._generate_suggestions(ai_message)
        }
    
    def _chat_fallback(self, user_message: str) -> Dict:
        """Fallback responses when no AI service is available"""
        fallback_responses = {
            "species": "For species identification, please upload an image to our classification tool or consult the species database in the platform.",
            "edna": "For eDNA analysis, please upload your sequence files using the eDNA analysis tool in the platform.",
            "ocean": "For oceanographic data interpretation, please check our real-time data dashboard and analytics tools.",
            "research": "For research methodology guidance, please explore our research publishing tools and documentation.",
            "default": "I'm currently operating in limited mode. Please ensure your AI service is properly configured with API keys. You can still use the platform's analysis tools for marine research."
        }
        
        message_lower = user_message.lower()
        response = fallback_responses["default"]
        
        for keyword, fallback_response in fallback_responses.items():
            if keyword in message_lower:
                response = fallback_response
                break
        
        return {
            "success": True,
            "response": response,
            "timestamp": datetime.now().isoformat(),
            "ai_service": "fallback",
            "suggestions": ["Upload data for analysis", "Explore platform tools", "Configure AI service"]
        }
    
    def _enhance_with_context(self, message: str, context: Optional[Dict]) -> str:
        """
        Enhance user message with platform context (recent data, analyses, etc.)
        """
        if not context:
            return message
        
        context_info = []
        
        # Add recent species data context
        if "recent_species" in context:
            species_list = ", ".join(context["recent_species"][:5])
            context_info.append(f"Recent species in analysis: {species_list}")
        
        # Add current location context
        if "location" in context:
            loc = context["location"]
            context_info.append(f"Current study location: {loc.get('name', 'Unknown')} ({loc.get('lat', 'N/A')}, {loc.get('lng', 'N/A')})")
        
        # Add recent eDNA results
        if "edna_results" in context:
            edna = context["edna_results"]
            context_info.append(f"Recent eDNA analysis: {edna.get('species_count', 0)} species detected")
        
        # Add recent classifications
        if "recent_classifications" in context:
            classifications = context["recent_classifications"][:3]
            class_info = [f"{c.get('species', 'Unknown')} ({c.get('confidence', 0):.1%})" for c in classifications]
            context_info.append(f"Recent classifications: {', '.join(class_info)}")
        
        if context_info:
            enhanced_message = f"""
Context from Matsya Platform:
{chr(10).join('- ' + info for info in context_info)}

User Question: {message}
"""
            return enhanced_message
        
        return message
    
    def _generate_suggestions(self, ai_response: str) -> List[str]:
        """
        Generate follow-up suggestions based on AI response
        """
        suggestions = []
        
        # Analyze response content and suggest relevant platform actions
        response_lower = ai_response.lower()
        
        if any(term in response_lower for term in ["species", "identify", "classification"]):
            suggestions.append("Upload an image for species classification")
            suggestions.append("Explore species occurrence data")
        
        if any(term in response_lower for term in ["dna", "edna", "genetic"]):
            suggestions.append("Upload eDNA sequence files for analysis")
            suggestions.append("View biodiversity assessment tools")
        
        if any(term in response_lower for term in ["location", "geographic", "distribution"]):
            suggestions.append("Explore the 3D marine map")
            suggestions.append("View geographic distribution data")
        
        if any(term in response_lower for term in ["research", "study", "analysis"]):
            suggestions.append("Access research publishing tools")
            suggestions.append("Create a new research project")
        
        if any(term in response_lower for term in ["data", "dataset", "database"]):
            suggestions.append("Upload taxonomy dataset")
            suggestions.append("Sync with OBIS database")
        
        return suggestions[:3]  # Return top 3 suggestions
    
    async def stream_chat(self, 
                         user_message: str, 
                         user_id: str = "default",
                         context: Optional[Dict] = None):
        """
        Streaming chat for real-time responses
        """
        try:
            if user_id not in self.conversations:
                self.conversations[user_id] = [
                    {"role": "system", "content": self.system_prompt}
                ]
            
            enhanced_message = self._enhance_with_context(user_message, context)
            self.conversations[user_id].append({
                "role": "user", 
                "content": enhanced_message
            })
            
            # Handle streaming based on available service
            if self.ai_service == "openai":
                async for chunk in self._stream_openai(user_id):
                    yield chunk
            elif self.ai_service == "claude":
                # Claude doesn't support streaming in the same way, so we'll simulate it
                async for chunk in self._stream_claude(user_id):
                    yield chunk
            else:
                # Fallback streaming
                response = self._chat_fallback(user_message)
                # Simulate streaming by sending the response in chunks
                words = response["response"].split()
                full_response = ""
                for word in words:
                    full_response += word + " "
                    yield {
                        "type": "chunk",
                        "content": word + " ",
                        "timestamp": datetime.now().isoformat()
                    }
                    await asyncio.sleep(0.1)  # Simulate typing delay
                
                yield {
                    "type": "complete",
                    "suggestions": response["suggestions"],
                    "timestamp": datetime.now().isoformat()
                }
            
        except Exception as e:
            yield {
                "type": "error",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    async def _stream_openai(self, user_id: str):
        """Stream OpenAI response"""
        stream = await self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=self.conversations[user_id][-10:],
            max_tokens=1000,
            temperature=0.7,
            stream=True
        )
        
        full_response = ""
        async for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                content = chunk.choices[0].delta.content
                full_response += content
                yield {
                    "type": "chunk",
                    "content": content,
                    "timestamp": datetime.now().isoformat()
                }
        
        # Add complete response to history
        self.conversations[user_id].append({
            "role": "assistant",
            "content": full_response
        })
        
        # Send final metadata
        yield {
            "type": "complete",
            "suggestions": self._generate_suggestions(full_response),
            "timestamp": datetime.now().isoformat()
        }
    
    async def _stream_claude(self, user_id: str):
        """Stream Claude response (simulated since Claude doesn't support streaming the same way)"""
        response_data = await self._chat_claude(user_id)
        
        # Simulate streaming by sending response in chunks
        words = response_data["response"].split()
        for word in words:
            yield {
                "type": "chunk", 
                "content": word + " ",
                "timestamp": datetime.now().isoformat()
            }
            await asyncio.sleep(0.05)  # Faster than fallback
        
        yield {
            "type": "complete",
            "suggestions": response_data["suggestions"],
            "timestamp": datetime.now().isoformat()
        }
    
    def clear_conversation(self, user_id: str):
        """Clear conversation history for a user"""
        if user_id in self.conversations:
            self.conversations[user_id] = [
                {"role": "system", "content": self.system_prompt}
            ]
    
    def get_conversation_summary(self, user_id: str) -> Dict:
        """Get conversation statistics and summary"""
        if user_id not in self.conversations:
            return {"message_count": 0, "topics": []}
        
        messages = self.conversations[user_id]
        user_messages = [msg for msg in messages if msg["role"] == "user"]
        
        return {
            "message_count": len(user_messages),
            "conversation_length": len(messages) - 1,  # Exclude system message
            "topics": self._extract_topics(user_messages)
        }
    
    def _extract_topics(self, messages: List[Dict]) -> List[str]:
        """Extract main topics from conversation"""
        # Simple keyword-based topic extraction
        topics = set()
        marine_keywords = {
            "species identification": ["species", "identify", "classification", "taxonomy"],
            "eDNA analysis": ["edna", "dna", "genetic", "sequence"],
            "oceanography": ["ocean", "temperature", "salinity", "current"],
            "conservation": ["conservation", "endangered", "protection", "sustainability"],
            "fisheries": ["fishing", "fisheries", "catch", "stock"],
            "biodiversity": ["biodiversity", "diversity", "ecosystem", "habitat"]
        }
        
        text = " ".join([msg["content"].lower() for msg in messages])
        
        for topic, keywords in marine_keywords.items():
            if any(keyword in text for keyword in keywords):
                topics.add(topic)
        
        return list(topics)

# Global chatbot instance
marine_chatbot = MarineResearchChatbot()