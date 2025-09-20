# 🤖 AI Chatbot Integration Guide for Matsya Ocean Insights

This guide covers multiple ways to integrate genuine AI chatbots into your marine research platform.

## 🎯 Integration Options

### **1. OpenAI GPT-4 Integration (Recommended)**
- **Cost**: $0.03/1k tokens (input), $0.06/1k tokens (output)
- **Quality**: Excellent for marine research questions
- **Setup Time**: 5 minutes
- **Features**: Streaming, context awareness, function calling

**Pros:**
- State-of-the-art marine knowledge
- Real-time streaming responses
- Excellent reasoning capabilities
- Function calling for platform integration

**Setup:**
```bash
# 1. Get API key from https://platform.openai.com/api-keys
# 2. Add to backend/.env:
OPENAI_API_KEY=sk-your-key-here

# 3. Already implemented in backend/app/chatbot.py
```

### **2. Anthropic Claude Integration**
- **Cost**: $0.015/1k tokens (input), $0.075/1k tokens (output)  
- **Quality**: Excellent, more analytical
- **Setup Time**: 10 minutes
- **Features**: Long context, careful reasoning

**Implementation:**
```python
# Add to chatbot.py
import anthropic

class ClaudeChatbot:
    def __init__(self):
        self.client = anthropic.Anthropic(
            api_key=os.getenv("ANTHROPIC_API_KEY")
        )
    
    async def chat(self, message: str, context: dict = None):
        system_prompt = """You are Dr. Marina, a marine biology expert..."""
        
        response = await self.client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=1000,
            system=system_prompt,
            messages=[{"role": "user", "content": message}]
        )
        
        return response.content[0].text
```

### **3. Google Gemini Integration (Free Tier)**
- **Cost**: Free up to 15 requests/minute
- **Quality**: Good for marine research
- **Setup Time**: 10 minutes
- **Features**: Multimodal, free tier

**Implementation:**
```python
# pip install google-generativeai
import google.generativeai as genai

class GeminiChatbot:
    def __init__(self):
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        self.model = genai.GenerativeModel('gemini-pro')
    
    async def chat(self, message: str, context: dict = None):
        prompt = f"""
        You are Dr. Marina, a marine biology expert...
        
        User question: {message}
        """
        
        response = self.model.generate_content(prompt)
        return response.text
```

### **4. Hugging Face Transformers (Open Source)**
- **Cost**: Free (self-hosted)
- **Quality**: Good for specific tasks
- **Setup Time**: 30 minutes
- **Features**: Offline, customizable

**Implementation:**
```python
# pip install transformers torch
from transformers import pipeline

class HuggingFaceChatbot:
    def __init__(self):
        self.chatbot = pipeline(
            "text-generation",
            model="microsoft/DialoGPT-medium",
            tokenizer="microsoft/DialoGPT-medium"
        )
    
    async def chat(self, message: str, context: dict = None):
        # Add marine science context
        marine_context = """
        You are a marine biology expert specializing in:
        - Species identification and taxonomy
        - Ocean ecosystem analysis
        - Marine conservation strategies
        - Oceanographic data interpretation
        """
        
        prompt = f"{marine_context}\n\nHuman: {message}\nAssistant:"
        
        response = self.chatbot(prompt, max_length=500, num_return_sequences=1)
        return response[0]['generated_text'].split("Assistant:")[-1].strip()
```

### **5. Local LLM with Ollama (Offline)**
- **Cost**: Free (uses your GPU/CPU)
- **Quality**: Good with proper models
- **Setup Time**: 45 minutes
- **Features**: Complete privacy, offline

**Setup:**
```bash
# 1. Install Ollama: https://ollama.ai/download
# 2. Download marine-focused model:
ollama pull llama2:7b-chat

# 3. Start Ollama server:
ollama serve
```

**Implementation:**
```python
import httpx

class OllamaChatbot:
    def __init__(self):
        self.base_url = "http://localhost:11434"
    
    async def chat(self, message: str, context: dict = None):
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": "llama2:7b-chat",
                    "prompt": f"""
                    You are Dr. Marina, a marine biology expert.
                    
                    Context: Marine research platform with species data
                    User question: {message}
                    
                    Response:""",
                    "stream": False
                }
            )
            
            return response.json()["response"]
```

## 🔧 Implementation Steps

### **Step 1: Choose Your AI Service**
Based on your needs:
- **Research accuracy**: OpenAI GPT-4
- **Cost-effective**: Anthropic Claude
- **Free option**: Google Gemini
- **Privacy/Offline**: Local LLM

### **Step 2: Update Backend Configuration**
```bash
# Add chosen service credentials to backend/.env
OPENAI_API_KEY=your_key_here
# OR
ANTHROPIC_API_KEY=your_key_here  
# OR
GOOGLE_API_KEY=your_key_here
```

### **Step 3: Install Dependencies**
```bash
# For OpenAI (already included)
pip install openai

# For Anthropic
pip install anthropic

# For Google Gemini
pip install google-generativeai

# For Hugging Face
pip install transformers torch

# For Ollama
pip install httpx
```

### **Step 4: Update Chatbot Service**
Replace the chatbot implementation in `backend/app/chatbot.py` with your chosen service.

### **Step 5: Test Integration**
```bash
# Start backend with new chatbot
cd backend
python -m uvicorn app.main:app --reload --port 8000

# Test via frontend chatbot page
# Or test directly via API:
curl -X POST "http://localhost:8000/api/chat" \
  -F "message=Tell me about coral reef ecosystems" \
  -F "user_id=test_user"
```

## 🌊 Marine Research Context Enhancement

### **Adding Marine Database Context**
```python
async def enhance_with_marine_context(self, message: str) -> str:
    """Add real marine data context to user questions"""
    
    # Fetch recent species data
    species_data = await get_recent_species()
    
    # Get current research projects
    projects = await get_active_projects()
    
    # Environmental data
    ocean_conditions = await get_ocean_conditions()
    
    enhanced_prompt = f"""
    Marine Research Context:
    - Recent species detected: {', '.join(species_data[:5])}
    - Active research areas: {', '.join(projects)}
    - Current ocean conditions: {ocean_conditions}
    
    User Question: {message}
    
    Please provide a response that considers this current research context.
    """
    
    return enhanced_prompt
```

### **Function Calling for Platform Integration**
```python
# Enable AI to trigger platform actions
tools = [
    {
        "type": "function",
        "function": {
            "name": "search_species",
            "description": "Search for marine species information",
            "parameters": {
                "type": "object", 
                "properties": {
                    "species_name": {"type": "string"},
                    "region": {"type": "string"}
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "analyze_edna",
            "description": "Analyze eDNA sample data",
            "parameters": {
                "type": "object",
                "properties": {
                    "sample_id": {"type": "string"}
                }
            }
        }
    }
]

# In your chat function:
response = await self.client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=tools,
    tool_choice="auto"
)

# Handle function calls
if response.choices[0].message.tool_calls:
    for tool_call in response.choices[0].message.tool_calls:
        if tool_call.function.name == "search_species":
            # Execute species search
            result = await search_species_database(tool_call.function.arguments)
```

## 💡 Best Practices

### **1. Cost Management**
- Set API usage limits
- Implement response caching for common questions
- Use cheaper models for simple questions

### **2. Performance Optimization**
- Stream responses for better UX
- Implement response caching
- Use async/await for better concurrency

### **3. Context Management**
- Keep conversation history manageable (last 10-15 messages)
- Include relevant platform data in context
- Clear context when switching topics

### **4. Error Handling**
```python
async def chat_with_fallback(self, message: str):
    """Implement fallback chain for reliability"""
    try:
        # Try primary AI service
        return await self.primary_ai.chat(message)
    except Exception as e:
        try:
            # Fallback to secondary service
            return await self.secondary_ai.chat(message)
        except Exception as e2:
            # Final fallback to static responses
            return self.get_fallback_response(message)
```

### **5. Marine Domain Specialization**
- Fine-tune prompts for marine research
- Include marine taxonomy in system prompts
- Add marine research methodology guidance
- Integrate with marine databases (OBIS, FishBase, WoRMS)

## 🔒 Security Considerations

1. **API Key Protection**: Never expose API keys in frontend code
2. **Rate Limiting**: Implement request limits per user
3. **Input Validation**: Sanitize user inputs
4. **Response Filtering**: Filter potentially harmful content
5. **User Authentication**: Require login for advanced features

## 📊 Monitoring & Analytics

```python
# Add to your chatbot implementation
async def log_conversation(self, user_id: str, message: str, response: str):
    """Track chatbot usage and performance"""
    await analytics.track({
        "user_id": user_id,
        "message_length": len(message),
        "response_length": len(response),
        "timestamp": datetime.now(),
        "ai_service": "openai",
        "tokens_used": response.usage.total_tokens if hasattr(response, 'usage') else 0
    })
```

Your **Matsya Ocean Insights** platform now has multiple pathways to integrate cutting-edge AI capabilities! Choose the option that best fits your budget, privacy requirements, and technical constraints.