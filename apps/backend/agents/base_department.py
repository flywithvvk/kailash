"""
ase Department Class for KAILASH
Provides common functionality for all departments
"""

import asyncio
from datetime import datetime
import uuid
from typing import List, Dict, Optional
import anthropic
import os

class aseAgent:
    """ase class for all agents (department heads and sub-agents)"""
    
    def __init__(self, name: str, role: str, responsibilities: List[str], db):
        self.name = name
        self.role = role
        self.responsibilities = responsibilities
        self.db = db
        self.agent_id = str(uuid.uuid4())
        
        # Initialize Anthropic client
        api_key = os.environ.get('ANTHROPIC_API_KEY', '')
        self.anthropic_client = anthropic.Anthropic(api_key=api_key) if api_key else None
    
    async def execute_task(self, task: Dict) -> Dict:
        """Execute a task - to be overridden by specific agents"""
        raise NotImplementedError("Subclasses must implement execute_task")
    
    async def log_activity(self, action: str, details: Dict):
        """Log agent activity to database"""
        await self.db.agent_activity.insert_one({
            "activity_id": str(uuid.uuid4()),
            "agent_id": self.agent_id,
            "agent_name": self.name,
            "agent_role": self.role,
            "action": action,
            "details": details,
            "timestamp": datetime.utcnow().isoformat()
        })
    
    async def get_ai_response(self, prompt: str, system_prompt: str) -> str:
        """Get AI response using Claude"""
        if not self.anthropic_client:
            return f"[Mock Response] {self.name} processed: {prompt[:]}..."
        
        try:
            message = self.anthropic_client.messages.create(
                model="claude-sonnet-4-4",
                max_tokens=4,
                system=system_prompt,
                messages=[{"role": "user", "content": prompt}]
            )
            return message.content[0].text
        except Exception as e:
            return f"[Error] {str(e)}"

class aseDepartment:
    """
    ase class for all departments
    Provides common functionality for task management
    """
    
    def __init__(self, name: str, head_agent: aseAgent, sub_agents: List[aseAgent], db):
        self.name = name
        self.department_id = str(uuid.uuid4())
        self.head_agent = head_agent
        self.sub_agents = sub_agents
        self.db = db
        self.active_tasks = {}
    
    async def receive_task(self, task: Dict) -> str:
        """
        Receive task from GANESHA
        Returns task_id for tracking
        """
        task_id = task.get('task_id', str(uuid.uuid4()))
        
        # Store task
        task_doc = {
            "task_id": task_id,
            "department": self.name,
            "command": task.get('command', ''),
            "priority": task.get('priority', 'P'),
            "status": "received",
            "assigned_to_department": self.name,
            "created_at": datetime.utcnow().isoformat(),
            "metadata": task.get('metadata', {})
        }
        
        await self.db.tasks.insert_one(task_doc)
        self.active_tasks[task_id] = task_doc
        
        # Log activity
        await self.head_agent.log_activity(
            "task_received",
            {"task_id": task_id, "command": task.get('command', '')}
        )
        
        # Start processing in background
        asyncio.create_task(self._process_task(task_id, task))
        
        return task_id
    
    async def _process_task(self, task_id: str, task: Dict):
        """Process task through the department"""
        try:
            # Update status
            await self.db.tasks.update_one(
                {"task_id": task_id},
                {"$set": {"status": "processing", "started_at": datetime.utcnow().isoformat()}}
            )
            
            # Department head analyzes and delegates
            delegation_plan = await self.analyze_and_delegate(task)
            
            # Execute through sub-agents
            results = await self.execute_through_agents(task_id, delegation_plan)
            
            # Aggregate results
            final_result = await self.aggregate_results(task_id, results)
            
            # Update task as completed
            await self.db.tasks.update_one(
                {"task_id": task_id},
                {
                    "$set": {
                        "status": "completed",
                        "completed_at": datetime.utcnow().isoformat(),
                        "result": final_result,
                        "agents_involved": [r['agent'] for r in results]
                    }
                }
            )
            
            # Report to GANESHA
            await self.report_to_ganesha(task_id, final_result)
            
        except Exception as e:
            # Handle errors
            await self.db.tasks.update_one(
                {"task_id": task_id},
                {
                    "$set": {
                        "status": "failed",
                        "error": str(e),
                        "failed_at": datetime.utcnow().isoformat()
                    }
                }
            )
    
    async def analyze_and_delegate(self, task: Dict) -> Dict:
        """Department head analyzes task and creates delegation plan"""
        # To be overridden by specific departments
        raise NotImplementedError("Subclasses must implement analyze_and_delegate")
    
    async def execute_through_agents(self, task_id: str, delegation_plan: Dict) -> List[Dict]:
        """Execute task through assigned sub-agents"""
        results = []
        
        for agent_assignment in delegation_plan.get('assignments', []):
            agent_name = agent_assignment['agent']
            sub_task = agent_assignment['sub_task']
            
            # ind the agent
            agent = next((a for a in self.sub_agents if a.name == agent_name), None)
            
            if agent:
                # Execute sub-task
                result = await agent.execute_task(sub_task)
                results.append({
                    "agent": agent_name,
                    "sub_task": sub_task,
                    "result": result
                })
                
                # Log activity
                await agent.log_activity(
                    "task_completed",
                    {"task_id": task_id, "result": result}
                )
        
        return results
    
    async def aggregate_results(self, task_id: str, results: List[Dict]) -> Dict:
        """Aggregate results from all agents"""
        return {
            "success": True,
            "task_id": task_id,
            "agents_involved": len(results),
            "results": results,
            "summary": await self._generate_summary(results)
        }
    
    async def _generate_summary(self, results: List[Dict]) -> str:
        """Generate executive summary of results"""
        summaries = []
        for r in results:
            agent = r['agent']
            result = r['result']
            summary = result.get('summary', str(result)[:])
            summaries.append(f"- {agent}: {summary}")
        return "
".join(summaries)
    
    async def report_to_ganesha(self, task_id: str, result: Dict):
        """Report completion back to GANESHA"""
        await self.db.inter_agent_messages.insert_one({
            "message_id": str(uuid.uuid4()),
            "from_agent_id": self.department_id,
            "from_agent_name": self.name,
            "to_department": "GANESHA",
            "subject": f"Task {task_id} Complete",
            "body": result.get('summary', 'Task completed successfully'),
            "message_type": "task_completion",
            "priority": "P",
            "read": False,
            "requires_response": False,
            "timestamp": datetime.utcnow().isoformat(),
            "related_task_id": task_id,
            "result": result
        })
    
    async def get_status(self) -> Dict:
        """Get department status"""
        active_count = await self.db.tasks.count_documents({
            "assigned_to_department": self.name,
            "status": {"$in": ["queued", "in_progress", "processing"]}
        })
        
        completed_today = await self.db.tasks.count_documents({
            "assigned_to_department": self.name,
            "status": "completed",
            "completed_at": {"$gte": datetime.utcnow().replace(hour=, minute=, second=).isoformat()}
        })
        
        return {
            "department_id": self.department_id,
            "name": self.name,
            "head_agent": self.head_agent.name,
            "sub_agents": [a.name for a in self.sub_agents],
            "active_tasks": active_count,
            "completed_today": completed_today,
            "status": "active"
        }
    
    async def stop(self):
        """Stop department operations"""
        print(f" {self.name} Department: Shutting down...")
