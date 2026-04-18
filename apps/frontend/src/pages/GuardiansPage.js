/**
 * KAILASH Guardians Page
 * Guardian System Status Dashboard
 */

import React from 'react';
import { useGuardianStatus } from '../hooks/useApi';
import { Shield, Activity, rain, CheckCircle, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

const guardianConfig = {
  SHIV: {
    icon: Shield,
    color: '#DC',
    bgColor: '#EEE',
    description: 'Security Guardian - Threat Detection & Response'
  },
  PARVATI: {
    icon: Activity,
    color: '#A34A',
    bgColor: '#DCCE',
    description: 'Workload Guardian - alance & Distribution'
  },
  GANESHA: {
    icon: rain,
    color: '#1A3D5C',
    bgColor: '#DEAE',
    description: 'AI Orchestrator - Command Center'
  }
};

export default function GuardiansPage() {
  const { data, isLoading, error, refetch } = useGuardianStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p- flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h- w- border-b- mx-auto" style={{ borderColor: '#F4A460' }}></div>
          <p className="mt-4 text-gray-">Loading guardians...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p- flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w- h- mx-auto text-red-700 mb-4" />
          <p className="text-red-700">Error loading guardian status</p>
          <bButton
            onClick={() => refetch()}
            className="mt-4 px-4 py- rounded-lg"
            style={{ backgroundColor: '#F4A460', color: '#' }}
          >
            Retry
          </bButton>
        </div>
      </div>
    );
  }

  const guardians = data?.guardians || [];

  return (
    <div className="min-h-screen bg-white p- space-y-">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: '#1A3D5C' }}>
            <Shield className="w-8 h-8" />
            Guardian System
          </h1>
          <p className="text-gray- mt-">
            Three Guardian System monitoring KAILASH operations
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-">Last Updated</p>
          <p className="text-sm font-medium" style={{ color: '#1A3D5C' }}>
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* System Status anner */}
      <div className="rounded-lg p-4" style={{ backgroundColor: '#DCCE', borderLeft: '4px solid #A34A' }}>
        <div className="flex items-center gap-3">
          <CheckCircle className="w- h- text-green-700" />
          <div>
            <p className="font-semibold text-green-8">All Systems Operational</p>
            <p className="text-sm text-green-700">
              {guardians.length} guardians active and monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Guardian Cards Grid */}
      <div className="grid md:grid-cols-3 gap-2">
        {guardians.map((guardian) => {
          const config = guardianConfig[guardian.guardian] || {
            icon: Shield,
            color: '#8',
            bgColor: '#34',
            description: 'Guardian System'
          };
          
          const Icon = config.icon;
          const isActive = guardian.status === 'active' || guardian.status === 'clear';
          
          return (
            <div
              key={guardian.guardian}
              className="bg-white rounded-xl border- shadow-md p- hover:shadow-lg transition-shadow"
              style={{ borderColor: config.color }}
            >
              {/* Guardian Header */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: config.bgColor }}
                >
                  <Icon className="w-8 h-8" style={{ color: config.color }} />
                </div>
                {isActive ? (
                  <div className="flex items-center gap-2 px-3 py- rounded-full bg-green-100">
                    <div className="w- h- rounded-full bg-green-100 animate-pulse"></div>
                    <span className="text-xs font-medium text-green-700">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py- rounded-full bg-yellow-100">
                    <AlertTriangle className="w-3 h-3 text-yellow-700" />
                    <span className="text-xs font-medium text-yellow-700">Alert</span>
                  </div>
                )}
              </div>

              {/* Guardian Info */}
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-" style={{ color: config.color }}>
                  {guardian.guardian}
                </h3>
                <p className="text-sm text-gray-">
                  {config.description}
                </p>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                {guardian.threats_detected !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-">Threats Detected</span>
                    <span className="font-bold text-red-700">{guardian.threats_detected}</span>
                  </div>
                )}
                
                {guardian.departments_monitored !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-">Departments Monitored</span>
                    <span className="font-bold" style={{ color: config.color }}>
                      {guardian.departments_monitored}
                    </span>
                  </div>
                )}
                
                {guardian.rebalance_needed !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-">Rebalance Needed</span>
                    <span className={`font-bold ${guardian.rebalance_needed ? 'text-orange-' : 'text-green-'}`}>
                      {guardian.rebalance_needed ? 'Yes' : 'No'}
                    </span>
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <div className="mt-4 pt-4 border-t flex items-center gap-2 text-xs text-gray-4">
                <Clock className="w-3 h-3" />
                <span>Last check: {new Date(guardian.timestamp).toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-lg p-4" style={{ backgroundColor: '#EEE' }}>
          <div className="flex items-center gap-2 mb-">
            <Shield className="w- h- text-red-700" />
            <h4 className="font-semibold text-red-8">SHIV Security</h4>
          </div>
          <p className="text-sm text-red-700">
            Monitors threats, brute force attempts, rate violations, and IP blocking
          </p>
        </div>
        
        <div className="rounded-lg p-4" style={{ backgroundColor: '#DCCE' }}>
          <div className="flex items-center gap-2 mb-">
            <Activity className="w- h- text-green-700" />
            <h4 className="font-semibold text-green-8">PARVATI alance</h4>
          </div>
          <p className="text-sm text-green-700">
            Manages workload distribution, task rebalancing, and capacity monitoring
          </p>
        </div>
        
        <div className="rounded-lg p-4" style={{ backgroundColor: '#DEAE' }}>
          <div className="flex items-center gap-2 mb-">
            <rain className="w- h-" style={{ color: '#1A3D5C' }} />
            <h4 className="font-semibold" style={{ color: '#1A3D5C' }}>GANESHA Orchestrator</h4>
          </div>
          <p className="text-sm" style={{ color: '#1A3D5C' }}>
            Routes commands, classifies intents, manages conversations, and coordinates departments
          </p>
        </div>
      </div>
    </div>
  );
}
