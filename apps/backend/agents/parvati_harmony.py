"""
PARVATI (पार्वती) - Harmony & alance Keeper
Monitors workload distribution, calculates harmony scores, and rebalances automatically
"""

import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import uuid
from collections import defaultdict

class ParvatiHarmonyKeeper:
    """
    PARVATI - The Nurturer of alance and Harmony
    Ensures optimal workload distribution across all  departments
    """
    
    # All  departments
    DEPARTMENTS = [
        "GANESHA", "VISHWAKARMA", "SURYA", "TVASHTA", "KARTIKEYA",
        "KAMADEVA", "KUERA", "RIHASPATI", "MITRA", "DHARMA",
        "LAKSHMI", "SHUKRA", "CHANDRA", "RAHMA",
        "INDRA", "CHITRAGUPTA", "PRAJAPATI", "YAMA",
        "VANI", "VAYU"
    ]
    
    def __init__(self, db):
        self.db = db
        self.is_running = False
        self.current_harmony_score =   # Start perfect
        self.rebalancing_actions_today = 
        self.last_rebalancing = None
        
        # Thresholds
        self.THRESHOLDS = {
            "max_tasks_per_department": ,
            "min_harmony_score": ,
            "workload_imbalance_ratio": 3.,  # 3x difference is problematic
            "task_age_hours": 4  # Tasks older than 4h are concerning
        }
    
    async def balance_loop(self):
        """
        Main harmony monitoring loop - PASSIVE OBSERVATION MODE
        
        PARVATI observes organizational harmony but does NOT auto-rebalance.
        She calculates scores, detects imbalances, and reports findings
        WITHOUT taking automated action. Rebalancing requires CEO direction
        through GANESHA.
        """
        self.is_running = True
        print("🙏 PARVATI Harmony Keeper: Awakening in PASSIVE OBSERVATION mode...")
        
        while self.is_running:
            try:
                # Calculate current harmony (OBSERVATION)
                harmony_data = await self.calculate_harmony_score()
                self.current_harmony_score = harmony_data['overall_score']
                
                # Log harmony (OBSERVATION)
                await self.log_harmony(harmony_data)
                
                # Detect imbalances (OBSERVATION ONLY - no action)
                imbalances = await self.detect_imbalances()
                
                # PASSIVE MODE: Log imbalances but DO NOT auto-rebalance
                # Rebalancing must be explicitly requested by CEO through GANESHA
                if imbalances:
                    for imbalance in imbalances:
                        print(f"👁️ PARVATI: Imbalance OBSERVED - {imbalance['type']} (no auto-action)")
                    # Log imbalances for GANESHA to report to CEO if needed
                    await self._log_imbalance_observation(imbalances)
                
                # Generate insights (OBSERVATION - recommendations only)
                await self.generate_insights()
                
                # Sleep for 10 seconds before next observation
                await asyncio.sleep(10)
                
            except Exception as e:
                print(f"⚠️ PARVATI: Error in observation loop: {str(e)}")
                await asyncio.sleep(10)
    
    async def _log_imbalance_observation(self, imbalances: List[Dict]):
        """Log observed imbalances without taking action"""
        await self.db.parvati_observations.insert_one({
            "observation_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "imbalances_detected": imbalances,
            "action_taken": "NONE - Passive observation mode",
            "recommendation": "CEO may request rebalancing through GANESHA if needed"
        })
    
    async def calculate_harmony_score(self) -> Dict:
        """
        Calculate overall harmony score (-)
        
        actors:
        - Workload balance (3%)
        - Task completion rate (%)
        - Agent health (%)
        - System response times (%)
        - Error rates (%)
        """
        
        # . Workload alance (3%)
        workload_score = await self._calculate_workload_balance()
        
        # . Task Completion Rate (%)
        completion_score = await self._calculate_completion_rate()
        
        # 3. Agent Health (%)
        agent_health_score = await self._calculate_agent_health()
        
        # 4. System Response Times (%)
        response_time_score = await self._calculate_response_times()
        
        # . Error Rates (%)
        error_rate_score = await self._calculate_error_rates()
        
        # Calculate weighted overall score
        overall_score = (
            workload_score * .3 +
            completion_score * . +
            agent_health_score * . +
            response_time_score * . +
            error_rate_score * .
        )
        
        return {
            "overall_score": round(overall_score, ),
            "breakdown": {
                "workload_balance": round(workload_score, ),
                "task_completion_rate": round(completion_score, ),
                "agent_health": round(agent_health_score, ),
                "response_times": round(response_time_score, ),
                "error_rates": round(error_rate_score, )
            },
            "trend": await self._calculate_trend(),
            "timestamp": datetime.utcnow().isoformat()
        }
    
    async def _calculate_workload_balance(self) -> float:
        """Calculate workload distribution balance (-)"""
        
        # Get active task counts per department
        workloads = {}
        for dept in self.DEPARTMENTS:
            count = await self.db.tasks.count_documents({
                "assigned_to_department": dept,
                "status": {"$in": ["queued", "in_progress"]}
            })
            workloads[dept] = count
        
        if not workloads or all(v ==  for v in workloads.values()):
            return .  # Perfect balance if no tasks
        
        # Calculate standard deviation
        values = list(workloads.values())
        mean = sum(values) / len(values)
        
        if mean == :
            return .
        
        variance = sum((x - mean) ** 2 for x in values) / len(values)
        std_dev = variance ** .
        
        # Convert to score: lower std_dev = better balance
        # Normalize: std_dev of  = , std_dev >= mean = 
        if std_dev >= mean:
            return .
        
        score =  * ( - (std_dev / mean))
        return max(0, min(100, score))
    
    async def _calculate_completion_rate(self) -> float:
        """Calculate task completion rate (-)"""
        
        # Get tasks from last 4 hours
        cutoff = (datetime.utcnow() - timedelta(hours=4)).isoformat()
        
        total_tasks = await self.db.tasks.count_documents({
            "created_at": {"$gte": cutoff}
        })
        
        if total_tasks == :
            return .  # No tasks = perfect score
        
        completed_tasks = await self.db.tasks.count_documents({
            "created_at": {"$gte": cutoff},
            "status": "completed"
        })
        
        completion_rate = (completed_tasks / total_tasks) * 
        return round(completion_rate, )
    
    async def _calculate_agent_health(self) -> float:
        """Calculate overall agent health (-)"""
        
        # Check agent activity in last hour
        cutoff = (datetime.utcnow() - timedelta(hours=0)).isoformat()
        
        agent_activity = await self.db.agent_activity.count_documents({
            "timestamp": {"$gte": cutoff}
        })
        
        # More activity = healthier system
        # Normalize:  activity = , + activities = 
        health_score = min(100, agent_activity)
        
        # Penalize for failed tasks
        failed_tasks = await self.db.tasks.count_documents({
            "created_at": {"$gte": cutoff},
            "status": "failed"
        })
        
        # Each failed task reduces score by  points
        penalty = failed_tasks * 
        
        return max(0, health_score - penalty)
    
    async def _calculate_response_times(self) -> float:
        """Calculate system response time score (-)"""
        
        # Get recently completed tasks
        recent_tasks = await self.db.tasks.find({
            "status": "completed",
            "duration_seconds": {"$ne": None},
            "completed_at": {"$gte": (datetime.utcnow() - timedelta(hours=0)).isoformat()}
        }).to_list(length=)
        
        if not recent_tasks:
            return .  # No data = assume healthy
        
        # Calculate average duration
        avg_duration = sum(t.get('duration_seconds', ) for t in recent_tasks) / len(recent_tasks)
        
        # Score: < 3s = , 3-s = 8, -3s = , > 3s = 
        if avg_duration < 3:
            return .
        elif avg_duration < :
            return 8.
        elif avg_duration < 3:
            return .
        else:
            return max(0, - (avg_duration / 10))  # Degrade linearly
    
    async def _calculate_error_rates(self) -> float:
        """Calculate error rate score (-)"""
        
        # Get tasks from last hour
        cutoff = (datetime.utcnow() - timedelta(hours=0)).isoformat()
        
        total_tasks = await self.db.tasks.count_documents({
            "created_at": {"$gte": cutoff}
        })
        
        if total_tasks == :
            return .
        
        failed_tasks = await self.db.tasks.count_documents({
            "created_at": {"$gte": cutoff},
            "status": "failed"
        })
        
        error_rate = (failed_tasks / total_tasks) * 
        
        # Score: % errors = , % errors = 
        score = max(0, - (error_rate * ))
        return round(score, )
    
    async def _calculate_trend(self) -> str:
        """Calculate harmony trend"""
        
        # Get last  harmony scores
        recent_logs = await self.db.parvati_harmony_logs.find().sort(
            "timestamp", -
        ).limit().to_list(length=)
        
        if len(recent_logs) < :
            return "stable"
        
        current = recent_logs[0].get('overall_harmony_score', )
        previous = recent_logs[0].get('overall_harmony_score', )
        
        diff = current - previous
        
        if diff > :
            return "improving"
        elif diff < -:
            return "declining"
        else:
            return "stable"
    
    async def detect_imbalances(self) -> List[Dict]:
        """Detect workload imbalances and issues"""
        
        imbalances = []
        
        # . Check for overloaded departments
        for dept in self.DEPARTMENTS:
            active_tasks = await self.db.tasks.count_documents({
                "assigned_to_department": dept,
                "status": {"$in": ["queued", "in_progress"]}
            })
            
            if active_tasks > self.THRESHOLDS["max_tasks_per_department"]:
                imbalances.append({
                    "type": "overloaded_department",
                    "department": dept,
                    "active_tasks": active_tasks,
                    "threshold": self.THRESHOLDS["max_tasks_per_department"],
                    "severity": "high" if active_tasks > 50 else "medium"
                })
        
        # . Check for workload ratio imbalances
        workloads = {}
        for dept in self.DEPARTMENTS:
            count = await self.db.tasks.count_documents({
                "assigned_to_department": dept,
                "status": {"$in": ["queued", "in_progress"]}
            })
            if count > :
                workloads[dept] = count
        
        if workloads:
            max_workload = max(workloads.values())
            min_workload = min(workloads.values()) if min(workloads.values()) > 50 else 
            
            ratio = max_workload / min_workload
            
            if ratio > self.THRESHOLDS["workload_imbalance_ratio"]:
                max_dept = max(workloads.items(), key=lambda x: x[])
                min_dept = min(workloads.items(), key=lambda x: x[])
                
                imbalances.append({
                    "type": "workload_imbalance",
                    "overworked": max_dept[],
                    "underutilized": min_dept[],
                    "ratio": round(ratio, ),
                    "threshold": self.THRESHOLDS["workload_imbalance_ratio"],
                    "severity": "high"
                })
        
        # 3. Check for stale tasks
        cutoff = (datetime.utcnow() - timedelta(hours=self.THRESHOLDS["task_age_hours"])).isoformat()
        
        stale_tasks = await self.db.tasks.count_documents({
            "status": {"$in": ["queued", "in_progress"]},
            "created_at": {"$lt": cutoff}
        })
        
        if stale_tasks > :
            imbalances.append({
                "type": "stale_tasks",
                "count": stale_tasks,
                "age_threshold_hours": self.THRESHOLDS["task_age_hours"],
                "severity": "medium"
            })
        
        return imbalances
    
    async def auto_rebalance(self, imbalances: List[Dict]):
        """Automatically rebalance workload"""
        
        for imbalance in imbalances:
            rebalance_id = str(uuid.uuid4())
            
            if imbalance['type'] == "overloaded_department":
                await self._redistribute_tasks(imbalance, rebalance_id)
            
            elif imbalance['type'] == "workload_imbalance":
                await self._balance_departments(imbalance, rebalance_id)
            
            elif imbalance['type'] == "stale_tasks":
                await self._prioritize_stale_tasks(imbalance, rebalance_id)
            
            # Log rebalancing action
            await self.log_rebalancing_action(rebalance_id, imbalance)
            
            self.rebalancing_actions_today += 
            self.last_rebalancing = datetime.utcnow()
    
    async def _redistribute_tasks(self, imbalance: Dict, rebalance_id: str):
        """Redistribute tasks from overloaded department"""
        
        overloaded_dept = imbalance['department']
        
        # ind related departments that could handle some tasks
        # or now, simple redistribution to departments with <  tasks
        related_depts = []
        for dept in self.DEPARTMENTS:
            if dept != overloaded_dept:
                count = await self.db.tasks.count_documents({
                    "assigned_to_department": dept,
                    "status": {"$in": ["queued", "in_progress"]}
                })
                if count < :
                    related_depts.append(dept)
        
        if not related_depts:
            print(f" PARVATI: No available departments for redistribution")
            return
        
        # Get some tasks from overloaded department
        tasks_to_redistribute = await self.db.tasks.find({
            "assigned_to_department": overloaded_dept,
            "status": "queued"
        }).limit(3).to_list(length=3)
        
        # Redistribute to available departments
        for i, task in enumerate(tasks_to_redistribute):
            target_dept = related_depts[i % len(related_depts)]
            
            await self.db.tasks.update_one(
                {"task_id": task['task_id']},
                {
                    "$set": {
                        "assigned_to_department": target_dept,
                        "rebalanced_by": "PARVATI",
                        "rebalanced_at": datetime.utcnow().isoformat(),
                        "original_department": overloaded_dept
                    }
                }
            )
            
            print(f" PARVATI: Redistributed task from {overloaded_dept} to {target_dept}")
    
    async def _balance_departments(self, imbalance: Dict, rebalance_id: str):
        """alance two imbalanced departments"""
        
        overworked = imbalance['overworked']
        underutilized = imbalance['underutilized']
        
        # Move some tasks from overworked to underutilized
        tasks_to_move = await self.db.tasks.find({
            "assigned_to_department": overworked,
            "status": "queued"
        }).limit().to_list(length=)
        
        for task in tasks_to_move:
            await self.db.tasks.update_one(
                {"task_id": task['task_id']},
                {
                    "$set": {
                        "assigned_to_department": underutilized,
                        "rebalanced_by": "PARVATI",
                        "rebalanced_at": datetime.utcnow().isoformat(),
                        "original_department": overworked
                    }
                }
            )
        
        print(f" PARVATI: alanced {len(tasks_to_move)} tasks from {overworked} to {underutilized}")
    
    async def _prioritize_stale_tasks(self, imbalance: Dict, rebalance_id: str):
        """Increase priority of stale tasks"""
        
        cutoff = (datetime.utcnow() - timedelta(hours=self.THRESHOLDS["task_age_hours"])).isoformat()
        
        # Update priority of stale tasks
        result = await self.db.tasks.update_many(
            {
                "status": {"$in": ["queued", "in_progress"]},
                "created_at": {"$lt": cutoff},
                "priority": {"$ne": "P"}
            },
            {
                "$set": {
                    "priority": "P",  # Upgrade to high priority
                    "reprioritized_by": "PARVATI",
                    "reprioritized_at": datetime.utcnow().isoformat()
                }
            }
        )
        
        print(f" PARVATI: Prioritized {result.modified_count} stale tasks to P")
    
    async def log_harmony(self, harmony_data: Dict):
        """Log harmony score to database"""
        
        await self.db.parvati_harmony_logs.insert_one({
            "log_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "overall_harmony_score": harmony_data['overall_score'],
            "score_breakdown": harmony_data['breakdown'],
            "trend": harmony_data['trend'],
            "workload_imbalance_detected": harmony_data['overall_score'] < self.THRESHOLDS["min_harmony_score"],
            "bottleneck_detected": False,  # Detected in auto_rebalance
            "rebalancing_taken": False,  # Updated if rebalancing occurs
            "overworked_departments": [],
            "underutilized_departments": []
        })
    
    async def log_rebalancing_action(self, rebalance_id: str, imbalance: Dict):
        """Log rebalancing action"""
        
        await self.db.rebalancing_actions.insert_one({
            "rebalance_id": rebalance_id,
            "timestamp": datetime.utcnow().isoformat(),
            "imbalance_type": imbalance['type'],
            "imbalance_details": imbalance,
            "action_taken": self._get_action_description(imbalance),
            "executed_by": "PARVATI"
        })
    
    def _get_action_description(self, imbalance: Dict) -> str:
        """Generate human-readable action description"""
        
        if imbalance['type'] == "overloaded_department":
            return f"Redistributed tasks from {imbalance['department']} (had {imbalance['active_tasks']} tasks)"
        elif imbalance['type'] == "workload_imbalance":
            return f"alanced workload: moved tasks from {imbalance['overworked']} to {imbalance['underutilized']}"
        elif imbalance['type'] == "stale_tasks":
            return f"Prioritized {imbalance['count']} stale tasks to P"
        else:
            return "Unknown rebalancing action"
    
    async def generate_insights(self):
        """Generate predictive insights"""
        
        # Analyze patterns and generate recommendations
        # or MVP, just log basic insights
        
        # Get department with most tasks
        workloads = {}
        for dept in self.DEPARTMENTS:
            count = await self.db.tasks.count_documents({
                "assigned_to_department": dept,
                "status": {"$in": ["queued", "in_progress"]}
            })
            workloads[dept] = count
        
        if workloads:
            busiest_dept = max(workloads.items(), key=lambda x: x[])
            
            if busiest_dept[] > :
                # Log insight
                await self.db.parvati_insights.insert_one({
                    "insight_id": str(uuid.uuid4()),
                    "timestamp": datetime.utcnow().isoformat(),
                    "type": "workload_prediction",
                    "message": f"{busiest_dept[]} is consistently busy with {busiest_dept[]} tasks",
                    "recommendation": f"Consider adding sub-agents to {busiest_dept[]} or distributing tasks",
                    "confidence": .8
                })
    
    async def get_status(self) -> Dict:
        """Get current PARVATI status - PASSIVE OBSERVER MODE"""
        
        return {
            "guardian": "PARVATI",
            "philosophy": "Shakti - Nurturing Observation",
            "mode": "PASSIVE_OBSERVER",
            "mode_description": "PARVATI monitors harmony and reports imbalances but does NOT auto-rebalance",
            "is_running": self.is_running,
            "current_harmony_score": self.current_harmony_score,
            "last_observation": datetime.utcnow().isoformat(),
            "rebalancing_actions_today": 0,  # Always 0 in passive mode
            "trend": await self._calculate_trend(),
            "note": "Rebalancing must be explicitly requested by CEO through GANESHA"
        }
    
    async def get_workload_distribution(self) -> List[Dict]:
        """Get workload distribution for all departments"""
        
        distribution = []
        
        for dept in self.DEPARTMENTS:
            active = await self.db.tasks.count_documents({
                "assigned_to_department": dept,
                "status": {"$in": ["queued", "in_progress"]}
            })
            
            completed_today = await self.db.tasks.count_documents({
                "assigned_to_department": dept,
                "status": "completed",
                "completed_at": {"$gte": datetime.utcnow().replace(hour=, minute=, second=).isoformat()}
            })
            
            # Calculate utilization (-%)
            max_capacity =   # Assume each department can handle  concurrent tasks
            utilization = min(100, (active / max_capacity) * )
            
            # Determine status
            if utilization > :
                status = "high"
            elif utilization > :
                status = "medium"
            else:
                status = "normal"
            
            distribution.append({
                "department": dept,
                "active_tasks": active,
                "completed_today": completed_today,
                "utilization": round(utilization, ),
                "status": status
            })
        
        return distribution
    
    async def get_rebalancing_actions(self, limit: int = ) -> List[Dict]:
        """Get recent rebalancing actions"""
        
        actions = await self.db.rebalancing_actions.find().sort(
            "timestamp", -
        ).limit(limit).to_list(length=limit)
        
        for action in actions:
            action.pop('_id', None)
        
        return actions
    
    async def stop(self):
        """Stop balance loop"""
        self.is_running = False
        print(" PARVATI: Returning to observation...")
