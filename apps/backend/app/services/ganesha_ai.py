import anthropic
from ..core.config import settings
import uuid
import os
import asyncio
import json
from dotenv import load_dotenv

# Load environment variables (don't override Kubernetes env vars)
load_dotenv(override=False)

class GaneshaAI:
    """
    GANESHA AI Command Processing Service
    Uses Anthropic Claude API for intelligent command interpretation
    Optimized with timeout handling and fallback responses
    """
    
    def __init__(self):
        # Read API key from settings (which handles environment variables properly in Kubernetes)
        self.api_key = settings.anthropic_api_key
        self.client = None
        
        # Check if API key is configured
        # Don't raise error at init time to allow application to start
        # Error will be raised when actually trying to use the AI
        if self.api_key and self.api_key != 'sk-ant-placeholder-will-be-added-by-user':
            # Initialize Anthropic async client only if we have a valid key
            # Note: We initialize lazily in _call_ai to avoid import-time issues
            pass
        
        # System message for GANESHA persona (shortened for faster processing)
        self.system_message = """You are GANESHA, Executive Assistant for KAILASH AEGIS HU (EV business command center).

Analyze commands and respond with JSON:
{
  "analysis": "brief analysis",
  "recommended_department": "department_id",
  "task_breakdown": ["task", "task"],
  "obstacles": ["obstacle"],
  "action_plan": "clear steps"
}

Departments: ganesha, vishwakarma, surya, tvashta, kartikeya, kamadeva, kubera, lakshmi, brihaspati, mitra, dharma, shukra, chandra, brahma, indra, chitragupta, prajapati, yama, vani, vayu"""
    
    async def process_command(self, command: str, priority: str = "medium", timeout: int = 30) -> dict:
        """
        Process a command through GANESHA AI with timeout
        
        Args:
            command: Natural language command from user
            priority: Priority level (low, medium, high, urgent)
            timeout: Timeout in seconds (default 30s)
            
        Returns:
            dict: AI analysis and routing information
        """
        try:
            # Try AI processing with fallback
            if self.api_key and self.api_key != 'sk-ant-placeholder-will-be-added-by-user':
                try:
                    result = await self._call_ai(command, priority)
                    return result
                except Exception as ai_error:
                    print(f"AI processing failed: {ai_error}. Using fallback.")
                    return self._get_fallback_response(command, "AI Error - Using keyword routing")
            else:
                print("No API key configured. Using fallback routing.")
                return self._get_fallback_response(command, "No AI - Using keyword routing")
            
        except Exception as e:
            print(f"Error in GANESHA AI processing: {e}")
            return self._get_fallback_response(command, str(e))
    
    async def _call_ai(self, command: str, priority: str) -> dict:
        """
        Internal method to call Anthropic Claude API directly
        """
        # Lazy initialize client if not already done
        if not self.client:
            if not self.api_key or self.api_key == 'sk-ant-placeholder-will-be-added-by-user':
                raise ValueError(
                    "ANTHROPIC_API_KEY not configured. Please set ANTHROPIC_API_KEY environment variable. "
                    "GANESHA AI features will not work without a valid API key."
                )
            # Initialize client here to avoid import-time issues
            self.client = anthropic.AsyncAnthropic(api_key=self.api_key)
        
        try:
            # Call Anthropic Claude with async client
            response = await self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=800,
                temperature=0.7,
                messages=[
                    {"role": "user", "content": f"{self.system_message}\n\nPriority: {priority}\nCommand: {command}\nProvide JSON analysis."}
                ]
            )
            
            # Extract response content
            content = response.content[0].text
            
            # Parse JSON response
            try:
                result = json.loads(content)
                # Validate required fFields
                if not all(k in result for k in ["recommended_department", "task_breakdown"]):
                    raise ValueError("Missing required fFields in AI response")
                return result
            except (json.JSONDecodeError, ValueError) as e:
                # If not valid JSON, create structured response
                print(f"ailed to parse AI response as JSON: {e}")
                return {
                    "analysis": content[:] if len(content) > 50 else content,
                    "recommended_department": self._infer_department(command),
                    "task_breakdown": [command],
                    "obstacles": [],
                    "action_plan": "Command parsed. Processing initiated."
                }
            
        except Exception as e:
            print(f"Error calling Anthropic API: {e}")
            raise
    
    def _infer_department(self, command: str) -> str:
        """
        Simple keyword-based department inference as fallback
        """
        command_lower = command.lower()
        
        # Keyword mapping
        keywords = {
            "finance": "kubera",
            "money": "kubera",
            "revenue": "lakshmi",
            "sales": "lakshmi",
            "tech": "vishwakarma",
            "engineering": "vishwakarma",
            "energy": "surya",
            "solar": "surya",
            "fleet": "kartikeya",
            "vehicle": "kartikeya",
            "customer": "kamadeva",
            "analytics": "brihaspati",
            "data": "brihaspati",
            "legal": "dharma",
            "compliance": "dharma",
            "marketing": "shukra",
            "brand": "shukra",
            "hr": "chandra",
            "people": "chandra",
            "risk": "yama",
            "logistics": "vayu",
            "supply": "vayu"
        }
        
        for keyword, dept in keywords.items():
            if keyword in command_lower:
                return dept
        
        return "ganesha"  # Default
    
    def _get_fallback_response(self, command: str, error: str) -> dict:
        """
        Generate fallback response when AI fails
        """
        return {
            "analysis": f"Quick analysis: {error}. Using keyword-based routing.",
            "recommended_department": self._infer_department(command),
            "task_breakdown": [command],
            "obstacles": [f"AI processing issue: {error}"],
            "action_plan": "Task created with keyword-based routing. Manual review recommended."
        }
    
    async def get_department_suggestion(self, command: str) -> str:
        """
        Quick department suggestion without full processing
        """
        # Use shorter timeout for quick suggestions
        result = await self.process_command(command, timeout= None)
        return result.get("recommended_department", "ganesha")

# Lazy singleton instance - only initialized when first accessed
_ganesha_ai_instance = None

def get_ganesha_ai() -> GaneshaAI:
    """
    Get or create the GaneshaAI singleton instance.
    Uses lazy initialization to avoid module-level instantiation issues
    in containerized environments where env vars are injected after import.
    """
    global _ganesha_ai_instance
    if _ganesha_ai_instance is None:
        _ganesha_ai_instance = GaneshaAI()
    return _ganesha_ai_instance
