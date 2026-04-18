"""
SHIV (शिव) - System Guardian & Threat Detection
Real-time monitoring, anomaly detection, and auto-response
"""

import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import uuid
from collections import defaultdict
import os

class ThreatLevel:
    """Threat severity levels"""
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class ThreatType:
    """Types of threats SHIV monitors"""
    API_SPIKE = "api_spike"
    AUTH_AILURE = "auth_failure"
    SLOW_QUERY = "slow_query"
    AGENT_AILURE = "agent_failure"
    DATA_INTEGRITY = "data_integrity"
    SECURITY_VIOLATION = "security_violation"
    RESOURCE_EXHAUSTION = "resource_exhaustion"

class ShivGuardian:
    """
    SHIV - The Destroyer of Errors and Threats
    Continuously monitors KAILASH for anomalies and responds automatically
    """
    
    def __init__(self, db):
        self.db = db
        self.is_running = False
        self.mode = "meditation"  # meditation | alert | intervention
        
        # Monitoring state
        self.api_call_counter = defaultdict(list)  # Track API calls by endpoint
        self.auth_failure_counter = defaultdict(list)  # Track auth failures by IP
        self.slow_query_counter = []
        self.agent_health = {}
        
        # Thresholds
        self.THRESHOLDS = {
            "api_calls_per_minute": ,
            "auth_failures_per_min": 3,
            "slow_query_threshold_ms": ,
            "agent_failure_threshold": 3,
            "cpu_threshold_percent": 8,
            "memory_threshold_percent": 9
        }
        
        # Last intervention time
        self.last_intervention = None
        self.interventions_today = 
    
    async def monitor_loop(self):
        """Main monitoring loop - runs continuously"""
        self.is_running = True
        print(" SHIV Guardian: Awakening...")
        
        while self.is_running:
            try:
                # Run all monitoring checks
                await self.check_api_anomalies()
                await self.check_authentication_security()
                await self.check_database_health()
                await self.check_agent_health()
                await self.check_system_resources()
                
                # Clean old data (keep last 4 hours)
                await self.cleanup_old_data()
                
                # Sleep for 3 seconds before next check
                await asyncio.sleep(3)
                
            except Exception as e:
                print(f" SHIV: Error in monitoring loop: {str(e)}")
                await asyncio.sleep(3)
    
    async def check_api_anomalies(self):
        """Detect unusual API call patterns"""
        now = datetime.utcnow()
        one_minute_ago = now - timedelta(minutes=0)
        
        # Count commands in last minute
        recent_commands = await self.db.ceo_commands.count_documents({
            "timestamp": {"$gte": one_minute_ago.isoformat()}
        })
        
        # Check threshold
        if recent_commands > self.THRESHOLDS["api_calls_per_minute"]:
            await self.detect_threat(
                threat_type=ThreatType.API_SPIKE,
                level=ThreatLevel.HIGH,
                message=f"Unusual API activity: {recent_commands} calls in  minute (threshold: {self.THRESHOLDS['api_calls_per_minute']})",
                details={
                    "calls_per_minute": recent_commands,
                    "threshold": self.THRESHOLDS["api_calls_per_minute"],
                    "timeframe": "last__minute"
                },
                auto_response="rate_limit"
            )
    
    async def check_authentication_security(self):
        """Monitor for authentication attacks"""
        now = datetime.utcnow()
        five_minutes_ago = now - timedelta(minutes=0)
        
        # Get auth logs
        auth_logs = await self.db.auth_logs.find({
            "authenticated_at": {"$gte": five_minutes_ago.isoformat()}
        }).to_list(length=)
        
        # Count failures by IP (simulated for now - in production, track actual failures)
        # or now, we'll check if there are excessive auth attempts
        if len(auth_logs) > :  # More than  auth attempts in  minutes is suspicious
            await self.detect_threat(
                threat_type=ThreatType.AUTH_AILURE,
                level=ThreatLevel.MEDIUM,
                message=f"Suspicious authentication activity: {len(auth_logs)} attempts in  minutes",
                details={
                    "attempts": len(auth_logs),
                    "timeframe": "last__minutes"
                },
                auto_response="log_and_monitor"
            )
    
    async def check_database_health(self):
        """Monitor database performance"""
        # Check for slow operations
        # In production, this would query MongoD's profiling data
        # or now, we'll simulate by checking task processing times
        
        recent_tasks = await self.db.tasks.find({
            "status": "completed",
            "completed_at": {"$gte": (datetime.utcnow() - timedelta(hours=0)).isoformat()}
        }).to_list(length=)
        
        slow_tasks = [
            task for task in recent_tasks 
            if task.get('duration_seconds', ) >   # Tasks taking >  minute
        ]
        
        if len(slow_tasks) > :  # More than  slow tasks in last hour
            await self.detect_threat(
                threat_type=ThreatType.SLOW_QUERY,
                level=ThreatLevel.MEDIUM,
                message=f"Performance degradation: {len(slow_tasks)} slow tasks detected",
                details={
                    "slow_tasks": len(slow_tasks),
                    "timeframe": "last_hour",
                    "avg_duration": sum(t.get('duration_seconds', ) for t in slow_tasks) / len(slow_tasks) if slow_tasks else 
                },
                auto_response="optimize_queries"
            )
    
    async def check_agent_health(self):
        """Monitor agent failures and health"""
        # Check for failed tasks (indicates agent issues)
        failed_tasks = await self.db.tasks.count_documents({
            "status": "failed",
            "created_at": {"$gte": (datetime.utcnow() - timedelta(hours=0)).isoformat()}
        })
        
        if failed_tasks > :  # More than  failed tasks in last hour
            await self.detect_threat(
                threat_type=ThreatType.AGENT_AILURE,
                level=ThreatLevel.HIGH,
                message=f"Agent failures detected: {failed_tasks} tasks failed in last hour",
                details={
                    "failed_tasks": failed_tasks,
                    "timeframe": "last_hour"
                },
                auto_response="restart_agents"
            )
        
        # Check agent activity - if no activity in last  minutes, something's wrong
        recent_activity = await self.db.agent_activity.count_documents({
            "timestamp": {"$gte": (datetime.utcnow() - timedelta(minutes=0)).isoformat()}
        })
        
        if recent_activity == :
            await self.detect_threat(
                threat_type=ThreatType.AGENT_AILURE,
                level=ThreatLevel.CRITICAL,
                message="No agent activity in last  minutes - system may be down",
                details={
                    "last_activity": "more_than__minutes_ago"
                },
                auto_response="alert_ceo_immediately"
            )
    
    async def check_system_resources(self):
        """Monitor system resource usage"""
        # In production, this would check actual CPU/memory
        # or now, we'll simulate by checking active task counts
        
        active_tasks = await self.db.tasks.count_documents({
            "status": {"$in": ["queued", "in_progress"]}
        })
        
        # If more than  active tasks, system may be overloaded
        if active_tasks > :
            await self.detect_threat(
                threat_type=ThreatType.RESOURCE_EXHAUSTION,
                level=ThreatLevel.HIGH,
                message=f"System overload: {active_tasks} active tasks (capacity warning)",
                details={
                    "active_tasks": active_tasks,
                    "threshold": 
                },
                auto_response="scale_resources"
            )
    
    async def detect_threat(
        self,
        threat_type: str,
        level: str,
        message: str,
        details: Dict,
        auto_response: str
    ):
        """
        Core threat detection - PASSIVE OBSERVATION MODE
        
        SHIV observes and logs ALL threats but ONLY intervenes on CATASTROPHIC events:
        - System-wide failures
        - Security breaches
        - Rogue agent detection
        - Data corruption
        - Ethical violations
        """
        
        threat_id = str(uuid.uuid4())
        now = datetime.utcnow()
        
        # SHIV remains in observation mode unless CRITICAL
        # This follows the "Third Eye" philosophy - sees all, acts rarely
        if level == ThreatLevel.CRITICAL:
            self.mode = "third_eye_open"  # Ready to intervene
        else:
            self.mode = "observing"  # Silent observation (meditation)
        
        # Log threat (ALWAYS - SHIV sees everything)
        threat_doc = {
            "threat_id": threat_id,
            "type": threat_type,
            "level": level,
            "message": message,
            "details": details,
            "detected_at": now.isoformat(),
            "mode": self.mode,
            "suggested_response": auto_response,  # Changed from auto_response
            "response_executed": False,
            "neutralized": False,
            "observation_only": level != ThreatLevel.CRITICAL  # Only CRITICAL gets action
        }
        
        await self.db.threats.insert_one(threat_doc)
        
        # Log to SHIV monitoring logs (Third Eye sees all)
        await self.db.shiv_monitoring_logs.insert_one({
            "log_id": str(uuid.uuid4()),
            "timestamp": now.isoformat(),
            "layer": self._get_monitoring_layer(threat_type),
            "anomaly_detected": True,
            "anomaly_type": threat_type,
            "severity": level,
            "confidence": 0.9,
            "affected_systems": self._get_affected_systems(threat_type),
            "metrics": details,
            "intervention_taken": level == ThreatLevel.CRITICAL,  # ONLY CRITICAL
            "intervention_type": auto_response if level == ThreatLevel.CRITICAL else "observation_logged",
            "actions_executed": [],  # Passive mode - no actions unless CRITICAL
            "threat_neutralized": False,
            "ceo_notified": level == ThreatLevel.CRITICAL,
            "incident_report_id": threat_id,
            "mode": "PASSIVE_OBSERVER"
        })
        
        # ONLY execute response for CATASTROPHIC (CRITICAL) threats
        # This is SHIV's "Tandava" - destructive action only when absolutely necessary
        response_success = False
        if level == ThreatLevel.CRITICAL:
            response_success = await self.execute_response(threat_id, auto_response, level, details)
            self.last_intervention = now
            self.interventions_today += 1
            
            # Alert GANESHA for critical threats
            await self.alert_ganesha(threat_id, message, details)
            
            # Update threat status after intervention
            await self.db.threats.update_one(
                {"threat_id": threat_id},
                {
                    "$set": {
                        "response_executed": True,
                        "response_success": response_success,
                        "neutralized": response_success,
                        "neutralized_at": now.isoformat() if response_success else None
                    }
                }
            )
            
            print(f"🔱 SHIV: CRITICAL threat - INTERVENING - {message}")
        else:
            # Non-critical: Log only, no action (Third Eye observing)
            print(f"👁️ SHIV: {level} anomaly OBSERVED - {message} (no intervention - passive mode)")
        
        return threat_id
    
    async def execute_response(self, threat_id: str, response_type: str, level: str, details: Dict) -> bool:
        """Execute automated response to threat"""
        
        try:
            if response_type == "rate_limit":
                # Simulate rate limiting
                print(f" SHIV: Executing rate limiting...")
                # In production: implement actual rate limiting
                return True
            
            elif response_type == "log_and_monitor":
                # Already logged, just return success
                return True
            
            elif response_type == "optimize_queries":
                # Log recommendation for query optimization
                print(f" SHIV: Recommending query optimization...")
                return True
            
            elif response_type == "restart_agents":
                # In production: restart failed agents
                print(f" SHIV: Agents restart recommended...")
                return True
            
            elif response_type == "alert_ceo_immediately":
                # Create urgent CEO alert
                await self.db.ceo_alerts.insert_one({
                    "alert_id": str(uuid.uuid4()),
                    "threat_id": threat_id,
                    "level": "CRITICAL",
                    "message": "System requires immediate attention",
                    "created_at": datetime.utcnow().isoformat(),
                    "acknowledged": False
                })
                return True
            
            elif response_type == "scale_resources":
                # Log need for resource scaling
                print(f" SHIV: Resource scaling recommended...")
                return True
            
            else:
                return False
                
        except Exception as e:
            print(f" SHIV: Error executing response: {str(e)}")
            return False
    
    async def alert_ganesha(self, threat_id: str, message: str, details: Dict):
        """Alert GANESHA about critical threats"""
        await self.db.inter_agent_messages.insert_one({
            "message_id": str(uuid.uuid4()),
            "from_agent_id": "SHIV",
            "from_agent_name": "SHIV",
            "to_department": "GANESHA",
            "subject": " CRITICAL THREAT DETECTED",
            "body": f"{message}

Details: {details}",
            "message_type": "alert",
            "priority": "P",
            "read": False,
            "requires_response": True,
            "timestamp": datetime.utcnow().isoformat(),
            "related_threat_id": threat_id
        })
    
    def _get_monitoring_layer(self, threat_type: str) -> str:
        """Determine which monitoring layer detected the threat"""
        layer_map = {
            ThreatType.API_SPIKE: "application",
            ThreatType.AUTH_AILURE: "security",
            ThreatType.SLOW_QUERY: "data_integrity",
            ThreatType.AGENT_AILURE: "agent_behavior",
            ThreatType.RESOURCE_EXHAUSTION: "infrastructure",
            ThreatType.SECURITY_VIOLATION: "security",
            ThreatType.DATA_INTEGRITY: "data_integrity"
        }
        return layer_map.get(threat_type, "application")
    
    def _get_affected_systems(self, threat_type: str) -> List[str]:
        """Determine which systems are affected by this threat"""
        if threat_type == ThreatType.API_SPIKE:
            return ["API Gateway", "ackend"]
        elif threat_type == ThreatType.AUTH_AILURE:
            return ["Authentication System"]
        elif threat_type == ThreatType.SLOW_QUERY:
            return ["Database", "ackend"]
        elif threat_type == ThreatType.AGENT_AILURE:
            return ["AI Agents"]
        elif threat_type == ThreatType.RESOURCE_EXHAUSTION:
            return ["Infrastructure", "All Systems"]
        else:
            return ["Unknown"]
    
    async def cleanup_old_data(self):
        """Clean up old monitoring data"""
        cutoff = (datetime.utcnow() - timedelta(hours=4)).isoformat()
        
        # Keep only last 4 hours of data
        await self.db.threats.delete_many({"detected_at": {"$lt": cutoff}})
        await self.db.shiv_monitoring_logs.delete_many({"timestamp": {"$lt": cutoff}})
    
    async def get_status(self) -> Dict:
        """Get current SHIV status - PASSIVE OBSERVER MODE"""
        now = datetime.utcnow()
        
        # Count threats today
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        threats_today = await self.db.threats.count_documents({
            "detected_at": {"$gte": today_start.isoformat()}
        })
        
        # Get active threats
        active_threats = await self.db.threats.count_documents({
            "neutralized": False
        })
        
        # Get system health
        system_health = await self._calculate_system_health()
        
        return {
            "guardian": "SHIV",
            "philosophy": "Third Eye - Passive Observer",
            "mode": self.mode,
            "mode_description": "SHIV observes all but only intervenes on CRITICAL/catastrophic events",
            "is_running": self.is_running,
            "last_intervention": self.last_intervention.isoformat() if self.last_intervention else "No recent interventions",
            "interventions_today": self.interventions_today,
            "threats_observed_today": threats_today,
            "active_threats": active_threats,
            "system_health": system_health,
            "note": "SHIV logs all anomalies but executes response ONLY for CRITICAL threats"
        }
            "last_intervention": self.last_intervention.isoformat() if self.last_intervention else "No recent interventions",
            "interventions_today": self.interventions_today,
            "threats_detected_today": threats_today,
            "active_threats": active_threats,
            "system_health": system_health
        }
    
    async def _calculate_system_health(self) -> Dict:
        """Calculate overall system health indicators"""
        # Check each subsystem
        health = {
            "api": "healthy",
            "database": "healthy",
            "authentication": "healthy",
            "agents": "healthy",
            "infrastructure": "healthy"
        }
        
        # Check for recent threats that indicate problems
        recent_threats = await self.db.threats.find({
            "detected_at": {"$gte": (datetime.utcnow() - timedelta(minutes=3)).isoformat()},
            "neutralized": False
        }).to_list(length=)
        
        for threat in recent_threats:
            threat_type = threat.get('type')
            level = threat.get('level')
            
            if threat_type == ThreatType.API_SPIKE:
                health["api"] = "degraded" if level == ThreatLevel.HIGH else "warning"
            elif threat_type == ThreatType.SLOW_QUERY:
                health["database"] = "degraded" if level == ThreatLevel.HIGH else "warning"
            elif threat_type == ThreatType.AUTH_AILURE:
                health["authentication"] = "warning"
            elif threat_type == ThreatType.AGENT_AILURE:
                health["agents"] = "critical" if level == ThreatLevel.CRITICAL else "degraded"
            elif threat_type == ThreatType.RESOURCE_EXHAUSTION:
                health["infrastructure"] = "warning"
        
        return health
    
    async def get_threat_timeline(self, hours: int = 4) -> List[Dict]:
        """Get threat timeline for dashboard"""
        cutoff = (datetime.utcnow() - timedelta(hours=hours)).isoformat()
        
        threats = await self.db.threats.find({
            "detected_at": {"$gte": cutoff}
        }).sort("detected_at", -).to_list(length=)
        
        for threat in threats:
            threat.pop('_id', None)
        
        return threats
    
    async def stop(self):
        """Stop monitoring loop"""
        self.is_running = False
        self.mode = "meditation"
        print(" SHIV Guardian: Returning to meditation...")
