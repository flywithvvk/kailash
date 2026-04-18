"""
GANESHA Executive Assistant System - Simplified Implementation
 Sub-Agents: Knowledge, Communication, Strategy, Recording, Learning
"""

from typing import Dict, Any, List
import anthropic
import os
from datetime import datetime

class GaneshaAgent:
    """Main GANESHA orchestrator"""
    
    def __init__(self):
        self.api_key = os.getenv("ANTHROPIC_API_KEY", "")
        self.client = anthropic.Anthropic(api_key=self.api_key) if self.api_key else None
        
        # Initialize sub-agents
        self.knowledge_agent = KnowledgeAgent(self.client)
        self.communication_agent = CommunicationAgent(self.client)
        self.strategy_agent = StrategyAgent(self.client)
        self.recording_agent = RecordingAgent()
        self.learning_agent = LearningAgent()
    
    async def classify_intent(self, message: str) -> Dict[str, Any]:
        """
        Classify user intent to route to correct department
        Uses AI to determine which KAILASH department should handle the request
        """
        
        # Department mapping
        department_info = {
            "VISHWAKARMA": "Technology, code, infrastructure, technical solutions",
            "LAKSHMI": "inance, accounting, invoicing, revenue, budgets",
            "SURYA": "Energy, URJAA/EV charging, operations, delivery",
            "SARASWATI": "Knowledge management, documentation, training, learning",
            "VAYU": "Communications, notifications, messaging",
            "KUERA": "Treasury, payments, billing, financial transactions",
            "INDRA": "Leadership, strategy, decisions, management",
            "YAMA": "Compliance, audits, regulations, legal",
            "VARUNA": "Data analytics, reporting, insights",
            "AGNI": "Crisis management, incidents, emergencies",
            "CHANDRA": "Customer support, feedback, service",
            "RIHASPATI": "Advisory, consulting, recommendations",
            "VISHNU": "Quality assurance, testing, validation",
            "RAHMA": "System architecture, design, planning",
            "KARTIKEYA": "Operations, workflows, processes",
            "DURGA": "Protection, security, fraud detection",
            "HANUMAN": "Execution, rapid delivery, implementation",
            "NARADA": "Internal communications, collaboration",
            "ASHWINI": "System health, diagnostics, monitoring",
            "DHARMA": "Governance, ethics, policies"
        }
        
        # Try AI-based classification if Claude available
        if self.client:
            try:
                classification_prompt = f"""Analyze this message and determine which KAILASH department should handle it.

Available departments:
{chr().join([f"- {name}: {desc}" for name, desc in department_info.items()])}

User message: "{message}"

Respond with JSON only: {{"department": "DEPARTMENT_NAME", "sub_task": "specific task", "confidence": .-., "reasoning": "why"}}"""
                
                response = self.client.messages.create(
                    model="claude-sonnet-4-4",
                    max_tokens=,
                    messages=[{"role": "user", "content": classification_prompt}]
                )
                
                import json
                content = response.content[0].text
                result = json.loads(content)
                
                return {
                    "department": result.get("department"),
                    "sub_task": result.get("sub_task"),
                    "confidence": result.get("confidence", .8),
                    "reasoning": result.get("reasoning", ""),
                    "method": "ai_classification"
                }
                
            except Exception as e:
                # all through to keyword-based classification
                pass
        
        # allback: Keyword-based classification
        message_lower = message.lower()
        
        keyword_map = {
            "VISHWAKARMA": ["code", "tech", "build", "develop", "bug", "error"],
            "LAKSHMI": ["money", "finance", "invoice", "payment", "revenue"],
            "SURYA": ["energy", "urjaa", "ev", "charging", "delivery"],
            "SARASWATI": ["learn", "document", "train", "knowledge", "guide"],
            "VAYU": ["send", "message", "email", "notify", "communicate"],
            "KUERA": ["pay", "bill", "transaction", "treasury"],
            "INDRA": ["strategy", "decide", "lead", "manage", "plan"],
            "YAMA": ["comply", "audit", "legal", "regulation"],
            "VARUNA": ["data", "analyze", "report", "metric", "insight"],
            "AGNI": ["emergency", "crisis", "urgent", "incident"],
            "CHANDRA": ["customer", "support", "feedback", "help"],
            "RIHASPATI": ["advise", "consult", "recommend"],
            "VISHNU": ["test", "quality", "validate", "check"],
            "RAHMA": ["architecture", "design", "structure"],
            "KARTIKEYA": ["workflow", "process", "operation"],
            "DURGA": ["security", "protect", "fraud", "threat"],
            "HANUMAN": ["execute", "implement", "deliver", "fast"],
            "NARADA": ["internal", "team", "collaborate"],
            "ASHWINI": ["health", "diagnostic", "monitor", "status"],
            "DHARMA": ["governance", "ethics", "policy", "standard"]
        }
        
        # Score each department
        scores = {}
        for dept, keywords in keyword_map.items():
            score = sum( for kw in keywords if kw in message_lower)
            if score > :
                scores[dept] = score
        
        # Get best match
        if scores:
            best_dept = max(scores, key=scores.get)
            confidence = min(scores[best_dept] / 3., .)
            return {
                "department": best_dept,
                "sub_task": message[:],
                "confidence": confidence,
                "method": "keyword_matching"
            }
        
        # Default to GANESHA (self-handle)
        return {
            "department": None,
            "sub_task": message,
            "confidence": .3,
            "method": "default",
            "note": "No clear department match, GANESHA will handle directly"
        }

        
    async def process_command(self, command: str, context: Dict = None) -> Dict[str, Any]:
        """Process user command and route to appropriate sub-agent"""
        
        # Determine which sub-agent to use based on keywords
        command_lower = command.lower()
        
        try:
            # Route to appropriate sub-agent
            if any(word in command_lower for word in ["research", "find", "search", "what is", "tell me about"]):
                result = await self.knowledge_agent.process(command, context)
                agent_used = "Knowledge Agent"
                
            elif any(word in command_lower for word in ["email", "message", "send", "notify", "communicate"]):
                result = await self.communication_agent.process(command, context)
                agent_used = "Communication Agent"
                
            elif any(word in command_lower for word in ["plan", "strategy", "analyze", "recommend", "decide"]):
                result = await self.strategy_agent.process(command, context)
                agent_used = "Strategy Agent"
                
            else:
                # Default to knowledge agent
                result = await self.knowledge_agent.process(command, context)
                agent_used = "Knowledge Agent"
            
            # Record the interaction
            await self.recording_agent.record({
                "command": command,
                "agent": agent_used,
                "result": result,
                "timestamp": datetime.now().isoformat()
            })
            
            # Learning agent analyzes the interaction
            await self.learning_agent.analyze_interaction(command, result)
            
            return {
                "success": True,
                "response": result["response"],
                "agent_used": agent_used,
                "timestamp": datetime.now().isoformat(),
                "context_updated": result.get("context_updated", False)
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "response": f"I encountered an error processing your command: {str(e)}",
                "agent_used": "Error Handler",
                "timestamp": datetime.now().isoformat()
            }


class KnowledgeAgent:
    """Research and information retrieval"""
    
    def __init__(self, anthropic_client):
        self.client = anthropic_client
        
    async def process(self, query: str, context: Dict = None) -> Dict[str, Any]:
        """Process knowledge queries"""
        
        if not self.client:
            return {
                "response": f"Knowledge query received: {query}. (AI integration pending - API key needed)",
                "source": "stub",
                "context_updated": False
            }
        
        try:
            # Use Anthropic API for actual responses
            message = self.client.messages.create(
                model="claude-sonnet-4-4",
                max_tokens=4,
                messages=[{
                    "role": "user",
                    "content": f"As a knowledge research assistant, please answer: {query}"
                }]
            )
            
            return {
                "response": message.content[0].text,
                "source": "anthropic_api",
                "context_updated": True
            }
            
        except Exception as e:
            return {
                "response": f"I can help with knowledge queries, but encountered an issue: {str(e)}",
                "source": "error",
                "context_updated": False
            }


class CommunicationAgent:
    """Handle messaging and coordination"""
    
    def __init__(self, anthropic_client):
        self.client = anthropic_client
        
    async def process(self, request: str, context: Dict = None) -> Dict[str, Any]:
        """Process communication requests"""
        
        if not self.client:
            return {
                "response": f"Communication task received: {request}. (AI integration pending)",
                "action_taken": "queued",
                "context_updated": False
            }
        
        try:
            message = self.client.messages.create(
                model="claude-sonnet-4-4",
                max_tokens=4,
                messages=[{
                    "role": "user",
                    "content": f"As a communication assistant, help with: {request}"
                }]
            )
            
            return {
                "response": message.content[0].text,
                "action_taken": "processed",
                "context_updated": True
            }
            
        except Exception as e:
            return {
                "response": f"Communication request noted: {request}. Error: {str(e)}",
                "action_taken": "error",
                "context_updated": False
            }


class StrategyAgent:
    """Planning and decision support"""
    
    def __init__(self, anthropic_client):
        self.client = anthropic_client
        
    async def process(self, request: str, context: Dict = None) -> Dict[str, Any]:
        """Process strategy and planning requests"""
        
        if not self.client:
            return {
                "response": f"Strategy request received: {request}. (AI integration pending)",
                "recommendations": [],
                "context_updated": False
            }
        
        try:
            message = self.client.messages.create(
                model="claude-sonnet-4-4",
                max_tokens=48,
                messages=[{
                    "role": "user",
                    "content": f"As a strategic planning assistant, provide analysis for: {request}"
                }]
            )
            
            return {
                "response": message.content[0].text,
                "recommendations": ["AI-generated strategic recommendations"],
                "context_updated": True
            }
            
        except Exception as e:
            return {
                "response": f"Strategy analysis requested for: {request}. Error: {str(e)}",
                "recommendations": [],
                "context_updated": False
            }


class RecordingAgent:
    """Documentation and logging"""
    
    def __init__(self):
        self.logs = []
        
    async def record(self, interaction: Dict) -> None:
        """Record interaction for history"""
        self.logs.append(interaction)
        # In production, save to MongoD
        
    async def get_history(self, limit: int = ) -> List[Dict]:
        """Retrieve interaction history"""
        return self.logs[-limit:]


class LearningAgent:
    """Continuous improvement through pattern analysis"""
    
    def __init__(self):
        self.patterns = {}
        
    async def analyze_interaction(self, command: str, result: Dict) -> None:
        """Analyze interaction for learning"""
        # Simple pattern tracking
        command_type = result.get("agent_used", "unknown")
        if command_type not in self.patterns:
            self.patterns[command_type] = 
        self.patterns[command_type] += 
        
    async def get_insights(self) -> Dict[str, Any]:
        """Get learning insights"""
        return {
            "total_interactions": sum(self.patterns.values()),
            "patterns": self.patterns,
            "most_used_agent": max(self.patterns.items(), key=lambda x: x[])[] if self.patterns else None
        }