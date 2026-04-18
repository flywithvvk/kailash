"""
Command Processor - Routes commands to appropriate departments/agents
"""

from typing import Dict, Any
from datetime import datetime

class CommandProcessor:
    """Central command processing and routing"""
    
    def __init__(self):
        self.command_history = []
        
    async def process(self, command: str, user_context: Dict = None) -> Dict[str, Any]:
        """Process and route commands"""
        
        command_lower = command.lower()
        
        # Determine routing
        if any(word in command_lower for word in ["tech", "code", "develop", "build", "engineering"]):
            department = "VISHWAKARMA"
            
        elif any(word in command_lower for word in ["finance", "budget", "cost", "revenue", "money"]):
            department = "LAKSHMI"
            
        elif any(word in command_lower for word in ["delivery", "urjaa", "operations", "dispatch"]):
            department = "SURYA"
            
        else:
            department = "GANESHA"  # Default to executive assistant
        
        # Log command
        self.command_history.append({
            "command": command,
            "routed_to": department,
            "timestamp": datetime.now().isoformat(),
            "user": user_context.get("user_id") if user_context else "unknown"
        })
        
        return {
            "routed_to": department,
            "status": "queued",
            "message": f"Command routed to {department} department",
            "estimated_processing_time": "- minutes"
        }
    
    async def get_history(self, limit: int = ) -> list:
        """Get command history"""
        return self.command_history[-limit:]