/**
 * Smart Action Rules Engine
 *
 * Client-side heuristic engine that evaluates entity data and returns
 * contextually intelligent menu action suggestions.
 * Zero latency - no API calls needed.
 *
 * Each rule: { id, entityTypes, condition, action, confidence }
 */

import {
  Mail,
  Phone,
  Target,
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  Gift,
  RefreshCw,
  CheckCircle,
  UserPlus,
  Star,
} from 'lucide-react';

// Helper: days since a date
function daysSince(dateStr) {
  if (!dateStr) return Infinity;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return Infinity;
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
}

// Helper: days until a date
function daysUntil(dateStr) {
  if (!dateStr) return Infinity;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return Infinity;
  return Math.floor((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

/**
 * All smart action rules
 * Rules are evaluated in order; highest-confidence matches win.
 */
export const SMART_ACTION_RULES = [
  // Lead not contacted in 7+ days
  {
    id: 'follow-up-lead',
    entityTypes: ['lead'],
    condition: (entity) => {
      const lastActivity = entity.last_activity_at || entity.last_contacted_at || entity.updated_at;
      return daysSince(lastActivity) >= 7;
    },
    action: {
      key: 'smart-follow-up',
      label: 'Follow Up Now',
      description: 'No contact in 7+ days',
      icon: Mail,
    },
    confidence: 0.9,
    handler: 'email',
  },

  // Hot lead - high score + new status
  {
    id: 'convert-hot-lead',
    entityTypes: ['lead'],
    condition: (entity) => {
      const score = entity.lead_score || entity.score || 0;
      const status = (entity.status || '').toLowerCase();
      return score > 80 && (status === 'new' || status === 'contacted');
    },
    action: {
      key: 'smart-convert-hot',
      label: 'Convert to Opportunity',
      description: 'Hot lead (score > 80)',
      icon: Target,
    },
    confidence: 0.95,
    handler: 'convert',
  },

  // Opportunity close-ready
  {
    id: 'close-deal',
    entityTypes: ['deal', 'opportunity'],
    condition: (entity) => {
      const probability = entity.probability || entity.win_probability || 0;
      const stage = (entity.stage || entity.status || '').toLowerCase();
      return probability > 70 && !stage.includes('closed') && !stage.includes('won') && !stage.includes('lost');
    },
    action: {
      key: 'smart-close-deal',
      label: 'Close This Deal',
      description: `${Math.round((entity) => entity.probability || entity.win_probability || 0)}% probability`,
      icon: TrendingUp,
    },
    confidence: 0.85,
    handler: 'closeWon',
  },

  // Contact birthday within 7 days
  {
    id: 'birthday-email',
    entityTypes: ['contact', 'lead'],
    condition: (entity) => {
      const birthday = entity.birthday || entity.date_of_birth;
      if (!birthday) return false;
      const bday = new Date(birthday);
      if (isNaN(bday.getTime())) return false;

      const now = new Date();
      const thisYearBirthday = new Date(now.getFullYear(), bday.getMonth(), bday.getDate());
      const diff = Math.floor((thisYearBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diff >= 0 && diff <= 7;
    },
    action: {
      key: 'smart-birthday',
      label: 'Send Birthday Email',
      description: 'Birthday coming up!',
      icon: Gift,
    },
    confidence: 0.8,
    handler: 'email',
  },

  // Task overdue
  {
    id: 'overdue-task',
    entityTypes: ['task'],
    condition: (entity) => {
      if (!entity.due_date) return false;
      const status = (entity.status || '').toLowerCase();
      if (status === 'completed' || status === 'done') return false;
      return daysSince(entity.due_date) > 0;
    },
    action: {
      key: 'smart-overdue',
      label: 'Reschedule or Complete',
      description: `Overdue by ${(entity) => daysSince(entity.due_date)} days`,
      icon: AlertTriangle,
    },
    confidence: 0.9,
    handler: 'reschedule',
  },

  // Deal stalling - no activity in 14+ days
  {
    id: 'stalling-deal',
    entityTypes: ['deal', 'opportunity'],
    condition: (entity) => {
      const lastActivity = entity.last_activity_at || entity.updated_at;
      const stage = (entity.stage || entity.status || '').toLowerCase();
      return daysSince(lastActivity) >= 14 && !stage.includes('closed') && !stage.includes('won') && !stage.includes('lost');
    },
    action: {
      key: 'smart-reengage',
      label: 'Re-engage: Send Follow-up',
      description: 'No activity in 14+ days',
      icon: RefreshCw,
    },
    confidence: 0.85,
    handler: 'email',
  },

  // Lead with phone but no call logged
  {
    id: 'call-lead',
    entityTypes: ['lead'],
    condition: (entity) => {
      const hasPhone = !!(entity.phone || entity.phone_number);
      const callCount = entity.call_count || entity.calls_count || 0;
      return hasPhone && callCount === 0;
    },
    action: {
      key: 'smart-first-call',
      label: 'Make First Call',
      description: 'Phone available, no calls yet',
      icon: Phone,
    },
    confidence: 0.75,
    handler: 'call',
  },

  // Contact with no deals - create one
  {
    id: 'create-deal',
    entityTypes: ['contact'],
    condition: (entity) => {
      const dealCount = entity.deal_count || entity.deals_count || 0;
      return dealCount === 0;
    },
    action: {
      key: 'smart-create-deal',
      label: 'Create First Deal',
      description: 'No deals for this contact',
      icon: Target,
    },
    confidence: 0.6,
    handler: 'createDeal',
  },

  // Task due today
  {
    id: 'due-today',
    entityTypes: ['task'],
    condition: (entity) => {
      if (!entity.due_date) return false;
      const status = (entity.status || '').toLowerCase();
      if (status === 'completed' || status === 'done') return false;
      const until = daysUntil(entity.due_date);
      return until === 0;
    },
    action: {
      key: 'smart-due-today',
      label: 'Mark Complete',
      description: 'Due today!',
      icon: CheckCircle,
    },
    confidence: 0.85,
    handler: 'complete',
  },

  // New lead - suggest qualification
  {
    id: 'qualify-lead',
    entityTypes: ['lead'],
    condition: (entity) => {
      const status = (entity.status || '').toLowerCase();
      const score = entity.lead_score || entity.score || 0;
      return status === 'new' && score < 50;
    },
    action: {
      key: 'smart-qualify',
      label: 'Qualify This Lead',
      description: 'New lead needs qualification',
      icon: Star,
    },
    confidence: 0.7,
    handler: 'qualify',
  },

  // Meeting due soon
  {
    id: 'upcoming-meeting',
    entityTypes: ['contact', 'lead'],
    condition: (entity) => {
      const nextMeeting = entity.next_meeting_at || entity.next_appointment;
      if (!nextMeeting) return false;
      const until = daysUntil(nextMeeting);
      return until >= 0 && until <= 1;
    },
    action: {
      key: 'smart-meeting-prep',
      label: 'Prepare for Meeting',
      description: 'Meeting coming up',
      icon: Calendar,
    },
    confidence: 0.8,
    handler: 'viewDetails',
  },

  // High value deal at risk
  {
    id: 'at-risk-deal',
    entityTypes: ['deal', 'opportunity'],
    condition: (entity) => {
      const value = entity.value || entity.amount || 0;
      const probability = entity.probability || entity.win_probability || 0;
      return value > 5000 && probability < 30 && probability > 0;
    },
    action: {
      key: 'smart-at-risk',
      label: 'Intervene: Deal at Risk',
      description: 'High value, low probability',
      icon: AlertTriangle,
    },
    confidence: 0.9,
    handler: 'viewDetails',
  },
];

/**
 * Evaluate all rules for an entity and return top N smart actions
 * @param {string} entityType - 'lead', 'contact', 'deal', 'task', etc.
 * @param {object} entityData - The entity data object
 * @param {number} maxActions - Maximum number of actions to return (default 3)
 * @returns {Array} Sorted array of smart actions
 */
export function evaluateSmartActions(entityType, entityData, maxActions = 3) {
  if (!entityType || !entityData) return [];

  const matches = [];

  for (const rule of SMART_ACTION_RULES) {
    // Check entity type match
    if (!rule.entityTypes.includes(entityType)) continue;

    // Evaluate condition
    try {
      if (rule.condition(entityData)) {
        // Build dynamic description if it's a function
        let description = rule.action.description;
        if (typeof description === 'function') {
          description = description(entityData);
        }

        matches.push({
          ...rule.action,
          description,
          isSmartAction: true,
          confidence: rule.confidence,
          ruleId: rule.id,
          handler: rule.handler,
        });
      }
    } catch {
      // Skip rules that throw (missing data)
    }
  }

  // Sort by confidence (highest first) and limit
  return matches
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, maxActions);
}
