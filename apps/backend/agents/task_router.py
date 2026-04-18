"""
Task Router - Manages task distribution across departments
"""

from typing import Dict, Any, List
from datetime import datetime
import uuid

class TaskRouter:
    """Routes tasks to appropriate departments and tracks them"""
    
    def __init__(self):
        self.active_tasks = {}
        self.completed_tasks = []
        
    async def create_task(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create and route a new task"""
        
        task_id = str(uuid.uuid4())
        
        task = {
            "task_id": task_id,
            "title": task_data.get("title", "Untitled Task"),
            "description": task_data.get("description", ""),
            "department": task_data.get("department", "GANESHA"),
            "priority": task_data.get("priority", "medium"),
            "status": "pending",
            "created_at": datetime.now().isoformat(),
            "assigned_to": None,
            "metadata": task_data.get("metadata", {})
        }
        
        self.active_tasks[task_id] = task
        
        return {
            "success": True,
            "task_id": task_id,
            "task": task,
            "message": f"Task created and routed to {task['department']}"
        }
    
    async def update_task_status(self, task_id: str, status: str, notes: str = None) -> Dict[str, Any]:
        """Update task status"""
        
        if task_id not in self.active_tasks:
            return {
                "success": False,
                "error": "Task not found"
            }
        
        self.active_tasks[task_id]["status"] = status
        self.active_tasks[task_id]["updated_at"] = datetime.now().isoformat()
        
        if notes:
            self.active_tasks[task_id]["notes"] = notes
        
        # If completed, move to completed tasks
        if status == "completed":
            self.completed_tasks.append(self.active_tasks[task_id])
            del self.active_tasks[task_id]
        
        return {
            "success": True,
            "task_id": task_id,
            "new_status": status
        }
    
    async def get_tasks_by_department(self, department: str) -> List[Dict]:
        """Get all tasks for a specific department"""
        return [
            task for task in self.active_tasks.values()
            if task["department"] == department
        ]
    
    async def get_task(self, task_id: str) -> Dict[str, Any]:
        """Get specific task"""
        if task_id in self.active_tasks:
            return {
                "success": True,
                "task": self.active_tasks[task_id]
            }
        
        # Check completed tasks
        for task in self.completed_tasks:
            if task["task_id"] == task_id:
                return {
                    "success": True,
                    "task": task
                }
        
        return {
            "success": False,
            "error": "Task not found"
        }