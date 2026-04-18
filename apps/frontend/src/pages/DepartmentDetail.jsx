import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DEPARTMENTS } from '../data/departmentsData';
import { DEPARTMENT_ICONS, UI_ICONS } from '../data/departmentIcons';
import { DataSourceBadge, AutomationBadge, ProblemResolutionCard } from '../components/InvestorDashboard';
import { useAuthStore } from '../stores/authStore';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Enhanced Department Configuration with data provenance, pre_data, and post_data
const DEPARTMENT_CONFIG = {
  // ===============================
  // INTERNAL DEPARTMENTS (15)
  // ===============================
  ganesha: { 
    name: 'GANESHA', 
    display_name: 'Executive AI Assistant', 
    scope: 'internal', 
    color: '#FFD700',
    source_product: 'KAILASH',
    data_sources: ['All Products', 'Internal Systems', 'AI Models'],
    problems_solved: [
      { description: 'Natural language command processing for executives', automation: 95 },
      { description: 'Intelligent task routing to optimal departments', automation: 90 },
      { description: 'Cross-department coordination', automation: 85 },
      { description: 'Obstacle identification and removal', automation: 80 }
    ],
    automation_percentage: 88,
    // NEW: Pre-Data (Rules, Thresholds, Policies)
    pre_data: {
      rules: [
        { name: 'Response Time SLA', value: '< 5 seconds', priority: 'HIGH' },
        { name: 'Routing Accuracy', value: '> 95%', priority: 'HIGH' },
        { name: 'Escalation Threshold', value: '3 failed attempts', priority: 'MEDIUM' }
      ],
      thresholds: {
        max_response_time: 5000,
        min_confidence: 0.85,
        max_retries: 3
      },
      policies: ['Always route financial queries to LAKSHMI', 'Technical issues go to VISHWAKARMA first']
    },
    // NEW: Post-Data (Real-time fetched data)
    post_data: {
      current_load: 72,
      queries_today: 156,
      avg_response_time: '2.1s',
      success_rate: 98.5,
      last_sync: 'Live'
    }
  },
  vishwakarma: { 
    name: 'VISHWAKARMA', 
    display_name: 'Chief Technology Officer', 
    scope: 'internal', 
    color: '#4F46E5',
    source_product: 'INTERNAL',
    data_sources: ['GitHub', 'AWS CloudWatch', 'Sentry', 'CI/CD Pipeline'],
    problems_solved: [
      { description: 'System architecture optimization', automation: 75 },
      { description: 'Infrastructure auto-scaling', automation: 90 },
      { description: 'Security vulnerability detection', automation: 85 },
      { description: 'DevOps automation', automation: 92 }
    ],
    automation_percentage: 85,
    pre_data: {
      rules: [
        { name: 'Uptime SLA', value: '99.9%', priority: 'CRITICAL' },
        { name: 'Deploy Frequency', value: 'Daily', priority: 'HIGH' },
        { name: 'Security Scan', value: 'Every commit', priority: 'HIGH' }
      ],
      thresholds: {
        cpu_alert: 80,
        memory_alert: 85,
        error_rate_max: 1
      },
      policies: ['Blue-green deployments only', 'All PRs require 2 approvals']
    },
    post_data: {
      current_load: 45,
      deployments_today: 3,
      open_issues: 12,
      uptime: '99.97%',
      last_sync: '2m ago'
    }
  },
  lakshmi: { 
    name: 'LAKSHMI', 
    display_name: 'Chief Financial Officer', 
    scope: 'internal', 
    color: '#F59E0B',
    source_product: 'INTERNAL',
    data_sources: ['Zoho Books', 'Bank APIs', 'Razorpay', 'GST Portal'],
    problems_solved: [
      { description: 'Automated expense categorization', automation: 90 },
      { description: 'Cash flow forecasting', automation: 80 },
      { description: 'Invoice reconciliation', automation: 95 },
      { description: 'Tax compliance automation', automation: 88 }
    ],
    automation_percentage: 88,
    pre_data: {
      rules: [
        { name: 'Invoice Due Alert', value: '7 days before', priority: 'HIGH' },
        { name: 'GST Filing', value: 'Monthly by 20th', priority: 'CRITICAL' },
        { name: 'Budget Variance', value: '< 10%', priority: 'MEDIUM' }
      ],
      thresholds: {
        low_cash_alert: 500000,
        payment_delay_max: 30,
        expense_approval_limit: 50000
      },
      policies: ['All expenses > ₹50K need CFO approval', 'Weekly cash flow review']
    },
    post_data: {
      cash_balance: '₹42.5L',
      pending_invoices: 8,
      revenue_today: '₹2.34L',
      expenses_today: '₹45K',
      last_sync: 'Live'
    }
  },
  kubera: { 
    name: 'KUBERA', 
    display_name: 'Chief Sales Officer', 
    scope: 'internal', 
    color: '#10B981',
    source_product: 'INTERNAL',
    data_sources: ['CRM', 'LinkedIn', 'Revenue Tracker', 'Sales Pipeline'],
    problems_solved: [
      { description: 'Lead scoring and qualification', automation: 85 },
      { description: 'Sales pipeline optimization', automation: 78 },
      { description: 'Revenue forecasting', automation: 82 },
      { description: 'Client churn prediction', automation: 75 }
    ],
    automation_percentage: 80,
    pre_data: {
      rules: [
        { name: 'Lead Follow-up', value: '< 24 hours', priority: 'HIGH' },
        { name: 'Pipeline Review', value: 'Weekly', priority: 'MEDIUM' },
        { name: 'Win Rate Target', value: '> 30%', priority: 'HIGH' }
      ],
      thresholds: {
        lead_score_min: 60,
        deal_size_min: 10000,
        follow_up_max_days: 7
      },
      policies: ['All enterprise deals need CEO involvement', 'Discount > 20% needs approval']
    },
    post_data: {
      active_deals: 23,
      pipeline_value: '₹1.2Cr',
      won_this_month: 5,
      conversion_rate: '32%',
      last_sync: '5m ago'
    }
  },
  kamadeva: { 
    name: 'KAMADEVA', 
    display_name: 'Chief Marketing Officer', 
    scope: 'internal', 
    color: '#EF4444',
    source_product: 'INTERNAL',
    data_sources: ['Google Ads', 'Meta Ads', 'Google Analytics', 'Social Media'],
    problems_solved: [
      { description: 'Campaign performance optimization', automation: 85 },
      { description: 'Content generation and scheduling', automation: 75 },
      { description: 'Audience targeting automation', automation: 80 },
      { description: 'Brand sentiment analysis', automation: 70 }
    ],
    automation_percentage: 78,
    pre_data: {
      rules: [
        { name: 'CAC Target', value: '< ₹500', priority: 'HIGH' },
        { name: 'Content Calendar', value: '2 weeks ahead', priority: 'MEDIUM' },
        { name: 'Brand Guidelines', value: 'Strict adherence', priority: 'HIGH' }
      ],
      thresholds: {
        ctr_min: 2.0,
        cpc_max: 50,
        roas_min: 3.0
      },
      policies: ['All creatives need brand approval', 'A/B test all campaigns']
    },
    post_data: {
      active_campaigns: 8,
      spend_today: '₹12K',
      leads_generated: 45,
      engagement_rate: '4.2%',
      last_sync: '10m ago'
    }
  },
  brihaspati: { 
    name: 'BRIHASPATI', 
    display_name: 'Investor Relations', 
    scope: 'internal', 
    color: '#3B82F6',
    source_product: 'INTERNAL',
    data_sources: ['Investor DB', 'Pitch Decks', 'Financial Reports', 'Board Minutes'],
    problems_solved: [
      { description: 'Investor communication automation', automation: 70 },
      { description: 'Financial presentation generation', automation: 80 },
      { description: 'Valuation modeling', automation: 75 },
      { description: 'Due diligence preparation', automation: 65 }
    ],
    automation_percentage: 72,
    pre_data: {
      rules: [
        { name: 'Investor Update', value: 'Monthly', priority: 'HIGH' },
        { name: 'Board Meeting', value: 'Quarterly', priority: 'CRITICAL' },
        { name: 'Data Room', value: 'Always current', priority: 'HIGH' }
      ],
      thresholds: {
        update_frequency_days: 30,
        response_time_hours: 24
      },
      policies: ['All investor comms via CEO', 'Confidential data needs NDA']
    },
    post_data: {
      active_investors: 12,
      pending_queries: 3,
      next_board_meeting: '15 days',
      data_room_status: 'Updated',
      last_sync: '1h ago'
    }
  },
  mitra: { 
    name: 'MITRA', 
    display_name: 'Partnerships & Alliances', 
    scope: 'internal', 
    color: '#8B5CF6',
    source_product: 'INTERNAL',
    data_sources: ['Partner Portal', 'Contract DB', 'Integration APIs'],
    problems_solved: [
      { description: 'Partner matching and recommendations', automation: 70 },
      { description: 'Contract analysis', automation: 75 },
      { description: 'Integration health monitoring', automation: 85 },
      { description: 'Partnership ROI tracking', automation: 80 }
    ],
    automation_percentage: 77,
    pre_data: {
      rules: [
        { name: 'Partner Review', value: 'Quarterly', priority: 'MEDIUM' },
        { name: 'Integration SLA', value: '99.5%', priority: 'HIGH' },
        { name: 'Contract Renewal', value: '60 days notice', priority: 'HIGH' }
      ],
      thresholds: {
        partner_score_min: 70,
        integration_uptime_min: 99.5
      },
      policies: ['All partnerships need legal review', 'Revenue share caps at 30%']
    },
    post_data: {
      active_partners: 18,
      integrations_live: 12,
      pending_renewals: 2,
      partner_revenue: '₹8.5L',
      last_sync: '30m ago'
    }
  },
  dharma: { 
    name: 'DHARMA', 
    display_name: 'Government Relations', 
    scope: 'internal', 
    color: '#059669',
    source_product: 'INTERNAL',
    data_sources: ['Govt Portals', 'Policy Tracker', 'Compliance DB'],
    problems_solved: [
      { description: 'Regulatory compliance monitoring', automation: 80 },
      { description: 'Policy change alerts', automation: 90 },
      { description: 'Document filing automation', automation: 85 },
      { description: 'Subsidy tracking', automation: 75 }
    ],
    automation_percentage: 82,
    pre_data: {
      rules: [
        { name: 'Compliance Check', value: 'Weekly', priority: 'CRITICAL' },
        { name: 'Policy Updates', value: 'Real-time', priority: 'HIGH' },
        { name: 'Filing Deadlines', value: 'Never miss', priority: 'CRITICAL' }
      ],
      thresholds: {
        compliance_score_min: 95,
        filing_buffer_days: 7
      },
      policies: ['All govt comms via legal', 'Document retention 7 years']
    },
    post_data: {
      compliance_score: '98%',
      pending_filings: 1,
      active_subsidies: 3,
      policy_alerts: 2,
      last_sync: '1h ago'
    }
  },
  shukra: { 
    name: 'SHUKRA', 
    display_name: 'Chief Strategy Officer', 
    scope: 'internal', 
    color: '#6366F1',
    source_product: 'INTERNAL',
    data_sources: ['Market Research', 'Competitor Intel', 'Industry Reports'],
    problems_solved: [
      { description: 'Market opportunity analysis', automation: 70 },
      { description: 'Competitor monitoring', automation: 85 },
      { description: 'Strategic scenario planning', automation: 65 },
      { description: 'Business model optimization', automation: 60 }
    ],
    automation_percentage: 70,
    pre_data: {
      rules: [
        { name: 'Competitor Review', value: 'Weekly', priority: 'HIGH' },
        { name: 'Strategy Review', value: 'Quarterly', priority: 'CRITICAL' },
        { name: 'Market Report', value: 'Monthly', priority: 'MEDIUM' }
      ],
      thresholds: {
        market_share_target: 15,
        growth_rate_min: 20
      },
      policies: ['Strategy changes need board approval', 'Competitive intel is confidential']
    },
    post_data: {
      market_position: '#3',
      competitor_alerts: 5,
      opportunities_identified: 8,
      strategic_initiatives: 4,
      last_sync: '2h ago'
    }
  },
  chandra: { 
    name: 'CHANDRA', 
    display_name: 'Data & Analytics', 
    scope: 'internal', 
    color: '#06B6D4',
    source_product: 'INTERNAL',
    data_sources: ['Data Warehouse', 'BI Tools', 'All Products'],
    problems_solved: [
      { description: 'Automated report generation', automation: 92 },
      { description: 'Anomaly detection', automation: 88 },
      { description: 'Predictive analytics', automation: 80 },
      { description: 'Data quality monitoring', automation: 85 }
    ],
    automation_percentage: 86,
    pre_data: {
      rules: [
        { name: 'Data Freshness', value: '< 5 minutes', priority: 'HIGH' },
        { name: 'Report Delivery', value: '8 AM daily', priority: 'MEDIUM' },
        { name: 'Data Quality', value: '> 99%', priority: 'CRITICAL' }
      ],
      thresholds: {
        data_lag_max_minutes: 5,
        quality_score_min: 99,
        anomaly_threshold: 2.5
      },
      policies: ['PII data needs encryption', 'Data retention as per policy']
    },
    post_data: {
      data_points_today: '2.4M',
      reports_generated: 15,
      anomalies_detected: 3,
      data_quality: '99.8%',
      last_sync: 'Live'
    }
  },
  indra: { 
    name: 'INDRA', 
    display_name: 'Chief Operating Officer', 
    scope: 'internal', 
    color: '#EF4444',
    source_product: 'INTERNAL',
    data_sources: ['Operations Dashboard', 'Process Metrics', 'Resource Tracker'],
    problems_solved: [
      { description: 'Process bottleneck identification', automation: 80 },
      { description: 'Resource optimization', automation: 85 },
      { description: 'Operational efficiency monitoring', automation: 88 },
      { description: 'Workflow automation', automation: 90 }
    ],
    automation_percentage: 86,
    pre_data: {
      rules: [
        { name: 'Process SLA', value: '< 24 hours', priority: 'HIGH' },
        { name: 'Resource Utilization', value: '> 80%', priority: 'MEDIUM' },
        { name: 'Bottleneck Alert', value: 'Immediate', priority: 'HIGH' }
      ],
      thresholds: {
        utilization_min: 80,
        bottleneck_threshold: 3,
        sla_breach_max: 0
      },
      policies: ['All processes documented', 'Weekly ops review']
    },
    post_data: {
      processes_active: 45,
      efficiency_score: '87%',
      bottlenecks: 2,
      sla_compliance: '96%',
      last_sync: '15m ago'
    }
  },
  chitragupta: { 
    name: 'CHITRAGUPTA', 
    display_name: 'Quality Assurance', 
    scope: 'internal', 
    color: '#10B981',
    source_product: 'INTERNAL',
    data_sources: ['Test Reports', 'Bug Tracker', 'QA Metrics'],
    problems_solved: [
      { description: 'Automated test execution', automation: 92 },
      { description: 'Defect prediction', automation: 75 },
      { description: 'Code quality analysis', automation: 88 },
      { description: 'Regression testing', automation: 95 }
    ],
    automation_percentage: 87,
    pre_data: {
      rules: [
        { name: 'Test Coverage', value: '> 80%', priority: 'HIGH' },
        { name: 'Bug Resolution', value: '< 48 hours', priority: 'MEDIUM' },
        { name: 'Release Quality', value: '0 P1 bugs', priority: 'CRITICAL' }
      ],
      thresholds: {
        coverage_min: 80,
        p1_bugs_max: 0,
        p2_bugs_max: 3
      },
      policies: ['No release without QA sign-off', 'All P1 bugs block release']
    },
    post_data: {
      test_coverage: '85%',
      open_bugs: 12,
      tests_run_today: 456,
      pass_rate: '98.2%',
      last_sync: '5m ago'
    }
  },
  prajapati: { 
    name: 'PRAJAPATI', 
    display_name: 'Product Management', 
    scope: 'internal', 
    color: '#8B5CF6',
    source_product: 'INTERNAL',
    data_sources: ['Product Roadmap', 'User Feedback', 'Feature Tracker'],
    problems_solved: [
      { description: 'Feature prioritization', automation: 70 },
      { description: 'User feedback analysis', automation: 85 },
      { description: 'Roadmap planning', automation: 65 },
      { description: 'Product metrics tracking', automation: 90 }
    ],
    automation_percentage: 77,
    pre_data: {
      rules: [
        { name: 'Sprint Planning', value: 'Bi-weekly', priority: 'HIGH' },
        { name: 'User Research', value: 'Monthly', priority: 'MEDIUM' },
        { name: 'Feature Review', value: 'Weekly', priority: 'HIGH' }
      ],
      thresholds: {
        nps_min: 50,
        feature_adoption_min: 30,
        churn_max: 5
      },
      policies: ['User feedback drives roadmap', 'A/B test all major features']
    },
    post_data: {
      features_in_progress: 8,
      user_requests: 34,
      nps_score: 62,
      adoption_rate: '78%',
      last_sync: '1h ago'
    }
  },
  yama: { 
    name: 'YAMA', 
    display_name: 'Legal & Compliance', 
    scope: 'internal', 
    color: '#6B7280',
    source_product: 'INTERNAL',
    data_sources: ['Contract DB', 'Legal Docs', 'Compliance Portal'],
    problems_solved: [
      { description: 'Contract review automation', automation: 75 },
      { description: 'Compliance monitoring', automation: 85 },
      { description: 'Legal document generation', automation: 70 },
      { description: 'Risk assessment', automation: 65 }
    ],
    automation_percentage: 74,
    pre_data: {
      rules: [
        { name: 'Contract Review', value: '< 48 hours', priority: 'HIGH' },
        { name: 'Compliance Audit', value: 'Quarterly', priority: 'CRITICAL' },
        { name: 'Risk Assessment', value: 'Monthly', priority: 'HIGH' }
      ],
      thresholds: {
        contract_review_hours: 48,
        compliance_score_min: 95,
        risk_score_max: 30
      },
      policies: ['All contracts need legal review', 'Compliance is non-negotiable']
    },
    post_data: {
      active_contracts: 67,
      pending_reviews: 5,
      compliance_score: '97%',
      risk_alerts: 1,
      last_sync: '2h ago'
    }
  },
  vayu: { 
    name: 'VAYU', 
    display_name: 'Sustainability & ESG', 
    scope: 'internal', 
    color: '#10B981',
    source_product: 'INTERNAL',
    data_sources: ['Carbon Tracker', 'ESG Metrics', 'Sustainability Reports'],
    problems_solved: [
      { description: 'Carbon footprint tracking', automation: 85 },
      { description: 'ESG reporting automation', automation: 80 },
      { description: 'Sustainability goal monitoring', automation: 78 },
      { description: 'Impact measurement', automation: 75 }
    ],
    automation_percentage: 79,
    pre_data: {
      rules: [
        { name: 'Carbon Report', value: 'Monthly', priority: 'HIGH' },
        { name: 'ESG Disclosure', value: 'Quarterly', priority: 'CRITICAL' },
        { name: 'Green Target', value: 'Net Zero by 2030', priority: 'HIGH' }
      ],
      thresholds: {
        carbon_reduction_target: 10,
        renewable_energy_min: 50
      },
      policies: ['Sustainability in all decisions', 'Track all emissions']
    },
    post_data: {
      carbon_saved: '12.5 tons',
      renewable_usage: '65%',
      esg_score: 'A-',
      green_initiatives: 5,
      last_sync: '1d ago'
    }
  },

  // ===============================
  // EXTERNAL DEPARTMENTS (3)
  // ===============================
  surya: { 
    name: 'SURYA', 
    display_name: 'URGAA Intelligence', 
    scope: 'external', 
    color: '#FFE66D',
    source_product: 'URGAA',
    data_sources: ['URGAA Database', 'OCPP WebSocket', 'DISCOM APIs', 'Charger Telemetry'],
    problems_solved: [
      { description: 'Charger health monitoring without physical inspection', automation: 85 },
      { description: 'Predictive maintenance reducing downtime by 70%', automation: 75 },
      { description: 'Auto-rectification of software issues remotely', automation: 90 },
      { description: 'Demand forecasting for capacity planning', automation: 70 },
      { description: 'Dynamic pricing optimization', automation: 80 }
    ],
    automation_percentage: 80,
    pre_data: {
      rules: [
        { name: 'Charger Uptime', value: '> 95%', priority: 'CRITICAL' },
        { name: 'Response Time', value: '< 15 minutes', priority: 'HIGH' },
        { name: 'Auto-Rectify First', value: 'Always', priority: 'CRITICAL' }
      ],
      thresholds: {
        uptime_min: 95,
        heartbeat_timeout: 300,
        stuck_session_minutes: 30,
        auto_retry_max: 3
      },
      policies: ['Auto-rectify before physical dispatch', 'Escalate after 3 failed attempts']
    },
    post_data: {
      chargers_online: 234,
      chargers_offline: 8,
      sessions_today: 1247,
      revenue_today: '₹1.8L',
      auto_fixes_today: 12,
      last_sync: 'Live'
    },
    // NEW: Physical Escalation Config
    escalation_config: {
      trigger_after_attempts: 3,
      escalation_channels: ['Field Team SMS', 'Operations Dashboard', 'Email Alert'],
      priority_matrix: {
        revenue_loss_high: 'P1 - Immediate',
        revenue_loss_medium: 'P2 - 4 hours',
        revenue_loss_low: 'P3 - 24 hours'
      }
    }
  },
  tvashta: { 
    name: 'TVASHTA', 
    display_name: 'GSTSAAS Intelligence', 
    scope: 'external', 
    color: '#8B5CF6',
    source_product: 'GSTSAAS',
    data_sources: ['GSTSAAS Database', 'Inventory System', 'Customer Records', 'GST Portal'],
    problems_solved: [
      { description: 'Inventory reorder prediction preventing stockouts', automation: 85 },
      { description: 'Customer churn prediction and retention', automation: 70 },
      { description: 'GST compliance automation', automation: 95 },
      { description: 'Technician productivity optimization', automation: 65 },
      { description: 'Service demand forecasting', automation: 80 }
    ],
    automation_percentage: 79,
    pre_data: {
      rules: [
        { name: 'Stock Alert', value: '< 20% inventory', priority: 'HIGH' },
        { name: 'GST Filing', value: 'Monthly by 20th', priority: 'CRITICAL' },
        { name: 'Customer Follow-up', value: '< 48 hours', priority: 'MEDIUM' }
      ],
      thresholds: {
        stock_alert_percent: 20,
        churn_risk_score: 70,
        gst_filing_buffer_days: 5
      },
      policies: ['Auto-reorder at threshold', 'Proactive churn intervention']
    },
    post_data: {
      workshops_active: 156,
      jobs_today: 423,
      gst_pending: 12,
      inventory_alerts: 8,
      last_sync: '15m ago'
    },
    escalation_config: {
      trigger_after_attempts: 3,
      escalation_channels: ['Workshop Owner SMS', 'Support Dashboard', 'Email'],
      priority_matrix: {
        compliance_risk: 'P1 - Immediate',
        stock_out: 'P2 - 4 hours',
        customer_complaint: 'P2 - 4 hours'
      }
    }
  },
  kartikeya: { 
    name: 'KARTIKEYA', 
    display_name: 'IGNITION Intelligence', 
    scope: 'external', 
    color: '#EC4899',
    source_product: 'IGNITION',
    data_sources: ['IGNITION App Analytics', 'User Database', 'Transaction Logs', 'Session Data'],
    problems_solved: [
      { description: 'Personalized charger recommendations', automation: 80 },
      { description: 'User churn prediction', automation: 70 },
      { description: 'Engagement optimization', automation: 75 },
      { description: 'Route-based charger suggestions', automation: 85 },
      { description: 'Payment friction reduction', automation: 60 }
    ],
    automation_percentage: 74,
    pre_data: {
      rules: [
        { name: 'App Performance', value: '< 3s load', priority: 'HIGH' },
        { name: 'User Engagement', value: '> 30% DAU/MAU', priority: 'MEDIUM' },
        { name: 'Payment Success', value: '> 98%', priority: 'CRITICAL' }
      ],
      thresholds: {
        app_load_time_max: 3000,
        crash_rate_max: 1,
        payment_success_min: 98
      },
      policies: ['Personalize all recommendations', 'A/B test all features']
    },
    post_data: {
      dau: 8547,
      sessions_today: 12340,
      transactions: 3456,
      app_rating: 4.5,
      last_sync: '5m ago'
    },
    escalation_config: {
      trigger_after_attempts: 3,
      escalation_channels: ['Tech Team Slack', 'App Health Dashboard', 'PagerDuty'],
      priority_matrix: {
        payment_failure: 'P1 - Immediate',
        app_crash: 'P1 - 1 hour',
        feature_bug: 'P2 - 24 hours'
      }
    }
  }
};

// Generate Sub-Agent data with latest output
const generateSubAgentData = (deptName, subAgents) => {
  const latestOutputs = {
    'ganesha': [
      'Processed 156 executive queries today with 98.5% accuracy',
      'Routed 45 tasks to optimal departments',
      'Identified 3 cross-department bottlenecks'
    ],
    'vishwakarma': [
      'Deployed v2.4.1 to production with zero downtime',
      'Auto-scaled infrastructure during peak load',
      'Fixed 2 security vulnerabilities'
    ],
    'lakshmi': [
      'Reconciled ₹12.5L in invoices automatically',
      'Generated monthly GST report',
      'Forecasted next month cash flow'
    ],
    'surya': [
      'Auto-rectified 12 charger issues remotely',
      'Predicted maintenance for 8 chargers',
      'Optimized pricing for 15 stations'
    ],
    'tvashta': [
      'Processed 423 workshop jobs',
      'Sent GST reminders to 12 workshops',
      'Predicted inventory needs for 34 items'
    ],
    'kartikeya': [
      'Personalized recommendations for 8,547 users',
      'Reduced payment friction by 15%',
      'Generated engagement report'
    ]
  };

  const outputs = latestOutputs[deptName?.toLowerCase()] || [
    'Completed daily analysis report',
    'Processed incoming requests',
    'Updated metrics dashboard'
  ];

  return (subAgents || []).map((agent, idx) => ({
    ...agent,
    latest_output: outputs[idx % outputs.length],
    last_activity: `${Math.floor(Math.random() * 30) + 1}m ago`
  }));
};

const DepartmentDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const deptKey = name?.toLowerCase();
  const department = DEPARTMENT_CONFIG[deptKey];
  
  // Find department data from main departments data
  const mainDeptData = DEPARTMENTS.find(d => d.id.toLowerCase() === deptKey);
  
  if (!department && !mainDeptData) {
    return (
      <div className="min-h-screen bg-dark-slate flex items-center justify-center">
        <div className="text-center p-8 bg-g4g-graphite rounded-xl border border-g4g-steel-grey max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-error-red/20 rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-error-red">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Department Not Found</h2>
          <p className="text-cool-grey mb-6">The department &quot;{name}&quot; does not exist in the system.</p>
          <button 
            onClick={() => navigate('/dashboard/executive')}
            className="px-6 py-3 bg-g4g-blue text-white font-semibold rounded-lg hover:bg-g4g-blue/80 transition-colors flex items-center gap-2 mx-auto"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Back to Executive Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Merge department data
  const dept = department || {};
  const mainData = mainDeptData || {};
  
  const displayName = dept.display_name || mainData.role || 'Department';
  const deptName = dept.name || mainData.name || name?.toUpperCase();
  const isExternal = dept.scope === 'external';
  const sourceProduct = dept.source_product || (isExternal ? 'External' : 'Internal');
  const automationPct = dept.automation_percentage || 75;
  const dataSources = dept.data_sources || ['Database', 'APIs'];
  const problemsSolved = dept.problems_solved || [];
  const subAgents = generateSubAgentData(deptKey, mainData.subAgents);
  const color = dept.color || mainData.color || '#FFC312';
  const preData = dept.pre_data || {};
  const postData = dept.post_data || {};
  const escalationConfig = dept.escalation_config || null;

  // Generate mock KPIs based on main data
  const kpis = [
    { name: 'Active Tasks', value: mainData.activeTasks || 12, trend: '+3' },
    { name: 'Workload', value: `${mainData.workload || 75}%`, trend: '→0%' },
    { name: 'Completed Today', value: mainData.completedToday || 8, trend: '+2' },
    { name: 'Automation Rate', value: `${automationPct}%`, trend: '+5%' },
    { name: 'Response Time', value: '2.3s', trend: '-15%' },
    { name: 'Success Rate', value: '98%', trend: '+1%' }
  ];

  const renderIcon = (svgString) => (
    <span dangerouslySetInnerHTML={{ __html: svgString }} />
  );

  // Tab content renderers
  const renderOverviewTab = () => (
    <>
      {/* KPIs Grid */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-g4g-graphite rounded-xl p-4 border border-g4g-steel-grey hover:border-g4g-electric-yellow/30 transition-all">
            <div className="text-xs text-cool-grey mb-2">{kpi.name}</div>
            <div className="text-2xl font-black text-g4g-electric-yellow">{kpi.value}</div>
            <div className={`text-xs font-semibold ${kpi.trend?.startsWith('+') ? 'text-highlight-teal' : kpi.trend?.startsWith('-') ? 'text-error-red' : 'text-cool-grey'}`}>
              {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Data Sources */}
        <div className="bg-g4g-graphite rounded-xl p-6 border border-g4g-steel-grey">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-g4g-electric-yellow">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>
            Data Sources
          </h2>
          <div className="space-y-3">
            {dataSources.map((source, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-dark-slate rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-highlight-teal rounded-full" />
                  <span className="text-white font-medium">{source}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-cool-grey">Real-time</span>
                  <span className="w-1.5 h-1.5 bg-highlight-teal rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members / Sub-Agents with Latest Output */}
        <div className="bg-g4g-graphite rounded-xl p-6 border border-g4g-steel-grey">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-g4g-electric-yellow">
              <circle cx="12" cy="6" r="4"/>
              <path d="M4 20c0-4.42 3.58-8 8-8s8 3.58 8 8"/>
            </svg>
            Team Members ({subAgents.length || 3})
          </h2>
          <div className="space-y-3">
            {(subAgents.length > 0 ? subAgents : [
              { name: `${deptName}-Analyst`, role: 'Data Analysis', status: 'active', workload: 75, latest_output: 'Completed daily analysis', last_activity: '5m ago' },
              { name: `${deptName}-Monitor`, role: 'Real-time Monitoring', status: 'active', workload: 60, latest_output: 'System health check passed', last_activity: '2m ago' },
              { name: `${deptName}-Reporter`, role: 'Report Generation', status: 'idle', workload: 40, latest_output: 'Generated weekly report', last_activity: '1h ago' }
            ]).map((agent, idx) => (
              <div key={idx} className="p-3 bg-dark-slate rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-white font-medium">{agent.name}</div>
                    <div className="text-xs text-cool-grey">{agent.role}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${agent.status === 'active' ? 'bg-highlight-teal/20 text-highlight-teal' : 'bg-cool-grey/20 text-cool-grey'}`}>
                    {agent.status}
                  </span>
                </div>
                {/* Workload bar */}
                <div className="mb-2">
                  <div className="h-1.5 bg-g4g-steel-grey rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-g4g-electric-yellow rounded-full"
                      style={{ width: `${agent.workload}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-cool-grey mt-1">{agent.workload}% load</div>
                </div>
                {/* NEW: Latest Output */}
                <div className="p-2 bg-g4g-graphite rounded border border-g4g-steel-grey/50">
                  <div className="text-[10px] text-cool-grey mb-1">Latest Output:</div>
                  <div className="text-xs text-white">{agent.latest_output}</div>
                  <div className="text-[10px] text-cool-grey mt-1">{agent.last_activity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Problems Solved Section */}
      {problemsSolved.length > 0 && (
        <div className="bg-g4g-graphite rounded-xl p-6 border border-g4g-steel-grey mb-6" style={{ borderLeftColor: color, borderLeftWidth: '4px' }}>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-highlight-teal">
              <path d="M9 12l2 2 4-4"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            Problems Solved by {deptName}
            {isExternal && <span className="text-sm font-normal text-cool-grey ml-2">via {sourceProduct}</span>}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {problemsSolved.map((problem, idx) => (
              <div key={idx} className="bg-dark-slate rounded-lg p-4">
                <p className="text-white mb-3">{problem.description}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="h-2 bg-g4g-steel-grey rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-highlight-teal rounded-full transition-all"
                        style={{ width: `${problem.automation}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-highlight-teal">{problem.automation}%</span>
                  <AutomationBadge automated={problem.automation > 70} showLabel={false} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  const renderPreDataTab = () => (
    <div className="space-y-6">
      {/* Rules Section */}
      <div className="bg-g4g-graphite rounded-xl p-6 border border-g4g-steel-grey">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-g4g-electric-yellow">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <path d="M14 2v6h6"/>
            <path d="M16 13H8"/>
            <path d="M16 17H8"/>
            <path d="M10 9H8"/>
          </svg>
          Rules & Policies
        </h2>
        
        {preData.rules && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-cool-grey uppercase tracking-wide mb-3">Business Rules</h3>
            <div className="space-y-2">
              {preData.rules.map((rule, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-dark-slate rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${rule.priority === 'CRITICAL' ? 'bg-error-red' : rule.priority === 'HIGH' ? 'bg-g4g-electric-yellow' : 'bg-cool-grey'}`} />
                    <span className="text-white">{rule.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-highlight-teal font-mono text-sm">{rule.value}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rule.priority === 'CRITICAL' ? 'bg-error-red/20 text-error-red' : rule.priority === 'HIGH' ? 'bg-g4g-electric-yellow/20 text-g4g-electric-yellow' : 'bg-cool-grey/20 text-cool-grey'}`}>
                      {rule.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {preData.thresholds && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-cool-grey uppercase tracking-wide mb-3">Thresholds</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(preData.thresholds).map(([key, value], idx) => (
                <div key={idx} className="p-3 bg-dark-slate rounded-lg">
                  <div className="text-xs text-cool-grey mb-1">{key.replace(/_/g, ' ').toUpperCase()}</div>
                  <div className="text-xl font-bold text-g4g-electric-yellow">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {preData.policies && (
          <div>
            <h3 className="text-sm font-bold text-cool-grey uppercase tracking-wide mb-3">Policies</h3>
            <div className="space-y-2">
              {preData.policies.map((policy, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-dark-slate rounded-lg">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-highlight-teal mt-0.5">
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                  <span className="text-white text-sm">{policy}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Escalation Config (for external departments) */}
      {escalationConfig && (
        <div className="bg-g4g-graphite rounded-xl p-6 border border-error-red/30">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-error-red">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Physical Escalation Configuration
          </h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-cool-grey uppercase tracking-wide mb-3">Escalation Trigger</h3>
              <div className="p-4 bg-dark-slate rounded-lg">
                <div className="text-3xl font-black text-error-red mb-1">{escalationConfig.trigger_after_attempts}</div>
                <div className="text-sm text-cool-grey">failed auto-rectification attempts</div>
              </div>
              
              <h3 className="text-sm font-bold text-cool-grey uppercase tracking-wide mb-3 mt-4">Escalation Channels</h3>
              <div className="space-y-2">
                {escalationConfig.escalation_channels.map((channel, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-dark-slate rounded-lg">
                    <span className="w-2 h-2 bg-error-red rounded-full" />
                    <span className="text-white text-sm">{channel}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-cool-grey uppercase tracking-wide mb-3">Priority Matrix</h3>
              <div className="space-y-2">
                {Object.entries(escalationConfig.priority_matrix).map(([issue, priority], idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-dark-slate rounded-lg">
                    <span className="text-white text-sm">{issue.replace(/_/g, ' ')}</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${priority.startsWith('P1') ? 'bg-error-red/20 text-error-red' : 'bg-g4g-electric-yellow/20 text-g4g-electric-yellow'}`}>
                      {priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPostDataTab = () => (
    <div className="space-y-6">
      {/* Live Metrics */}
      <div className="bg-g4g-graphite rounded-xl p-6 border border-g4g-steel-grey">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-highlight-teal">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            Live Metrics
          </h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-highlight-teal rounded-full animate-pulse" />
            <span className="text-xs text-highlight-teal font-medium">Last sync: {postData.last_sync || 'Live'}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(postData).filter(([key]) => key !== 'last_sync').map(([key, value], idx) => (
            <div key={idx} className="p-4 bg-dark-slate rounded-xl border border-g4g-steel-grey/50">
              <div className="text-xs text-cool-grey mb-2">{key.replace(/_/g, ' ').toUpperCase()}</div>
              <div className="text-2xl font-black text-g4g-electric-yellow">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-g4g-graphite rounded-xl p-6 border border-g4g-steel-grey">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-g4g-electric-yellow">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          Recent Activity
        </h2>
        
        <div className="space-y-3">
          {[
            { time: '2 min ago', action: 'Processed incoming data batch', status: 'success' },
            { time: '5 min ago', action: 'Generated automated report', status: 'success' },
            { time: '12 min ago', action: 'Detected anomaly - auto-resolved', status: 'warning' },
            { time: '18 min ago', action: 'Synced with external data source', status: 'success' },
            { time: '25 min ago', action: 'Updated prediction models', status: 'success' }
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-dark-slate rounded-lg">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-highlight-teal' : 'bg-g4g-electric-yellow'}`} />
                <span className="text-white text-sm">{activity.action}</span>
              </div>
              <span className="text-xs text-cool-grey">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      <div className="bg-g4g-graphite rounded-xl p-6 border border-g4g-steel-grey">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-g4g-electric-yellow">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <path d="M14 2v6h6"/>
            <path d="M16 13H8"/>
            <path d="M16 17H8"/>
          </svg>
          Generated Reports
        </h2>
        
        <div className="space-y-3">
          {[
            { name: 'Daily Performance Report', date: 'Today, 8:00 AM', type: 'Auto-generated', size: '2.4 MB' },
            { name: 'Weekly Analytics Summary', date: 'Dec 14, 2025', type: 'Auto-generated', size: '5.1 MB' },
            { name: 'Monthly KPI Dashboard', date: 'Dec 1, 2025', type: 'Auto-generated', size: '8.7 MB' },
            { name: 'Anomaly Detection Report', date: 'Dec 12, 2025', type: 'Triggered', size: '1.2 MB' },
            { name: 'Automation Efficiency Report', date: 'Dec 10, 2025', type: 'Manual', size: '3.5 MB' }
          ].map((report, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-dark-slate rounded-lg hover:border-g4g-electric-yellow/30 border border-transparent transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-g4g-electric-yellow/10 rounded-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-g4g-electric-yellow">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <path d="M14 2v6h6"/>
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium">{report.name}</div>
                  <div className="text-xs text-cool-grey">{report.date} • {report.size}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${report.type === 'Auto-generated' ? 'bg-highlight-teal/20 text-highlight-teal' : report.type === 'Triggered' ? 'bg-g4g-electric-yellow/20 text-g4g-electric-yellow' : 'bg-cool-grey/20 text-cool-grey'}`}>
                  {report.type}
                </span>
                <button className="p-2 text-cool-grey hover:text-white transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <path d="M7 10l5 5 5-5"/>
                    <path d="M12 15V3"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-slate">
      {/* Header */}
      <header className="bg-g4g-blue border-b border-g4g-steel-grey px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-[1920px] mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard/executive')}
              className="p-2 text-cool-grey hover:text-white transition-colors rounded-lg hover:bg-white/10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
                <span style={{ color }} className="text-2xl">
                  {renderIcon(DEPARTMENT_ICONS[deptKey?.toUpperCase()] || DEPARTMENT_ICONS.GANESHA)}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-black text-white">{deptName}</h1>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${isExternal ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                    {isExternal ? 'EXTERNAL' : 'INTERNAL'}
                  </span>
                </div>
                <p className="text-sm text-cool-grey">{displayName}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isExternal && (
              <DataSourceBadge source={sourceProduct} type="external" />
            )}
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-highlight-teal rounded-full animate-pulse" />
              <span className="text-highlight-teal font-medium">ACTIVE</span>
            </div>
            <button className="px-4 py-2 bg-g4g-graphite text-cool-grey text-sm font-medium rounded-lg hover:text-white transition-colors">
              Settings
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 bg-g4g-graphite rounded-lg hover:bg-g4g-steel-grey transition-colors"
              >
                <div className="w-8 h-8 bg-g4g-electric-yellow/20 rounded-full flex items-center justify-center">
                  <span className="text-g4g-electric-yellow font-bold text-sm">
                    {user?.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cool-grey">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-g4g-graphite rounded-xl border border-g4g-steel-grey shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-g4g-steel-grey">
                    <p className="text-white font-semibold text-sm">{user?.full_name || 'User'}</p>
                    <p className="text-xs text-cool-grey">{user?.aegis_code || 'AEGIS'}</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => { navigate('/dashboard/executive'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-cool-grey hover:text-white hover:bg-g4g-steel-grey/50 rounded-lg transition-colors text-sm"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7"/>
                        <rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                      </svg>
                      Dashboard
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-error-red hover:bg-error-red/10 rounded-lg transition-colors text-sm"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto p-6">
        {/* Status Bar */}
        <div className="flex items-center justify-between bg-g4g-graphite rounded-xl p-4 mb-6 border border-g4g-steel-grey">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-cool-grey">Source Product:</span>
              <DataSourceBadge source={sourceProduct} />
            </div>
            <div className="h-4 w-px bg-g4g-steel-grey" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-cool-grey">Last Activity:</span>
              <span className="text-sm text-white">Just now</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-highlight-teal/10 rounded-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-highlight-teal">
              <path d="M9 12l2 2 4-4"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <span className="text-highlight-teal font-semibold">{automationPct}% Automated</span>
            <span className="text-xs text-cool-grey">(No human needed)</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-g4g-steel-grey pb-2">
          {['overview', 'pre-data', 'post-data', 'reports'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-g4g-electric-yellow text-dark-slate' : 'text-cool-grey hover:text-white hover:bg-g4g-steel-grey/50'}`}
            >
              {tab === 'pre-data' ? 'Pre-Data (Rules)' : tab === 'post-data' ? 'Post-Data (Live)' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'pre-data' && renderPreDataTab()}
        {activeTab === 'post-data' && renderPostDataTab()}
        {activeTab === 'reports' && renderReportsTab()}
      </main>
    </div>
  );
};

export default DepartmentDetail;
