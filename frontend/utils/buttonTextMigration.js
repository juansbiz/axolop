/**
 * Button Text Migration Utilities
 * Handles backwards compatibility for forms without button_text field
 * Automatically adds button_text to existing questions on load
 */

import { createDefaultButtonConfig } from '@/models/buttonTextModel';

/**
 * Check if form data needs migration
 * Old forms don't have button_text field on questions
 *
 * @param {Object} formData - Form data to check
 * @returns {boolean} True if form needs migration
 */
export function needsMigration(formData) {
  // Check if any question lacks button_text field
  if (formData.questions?.some(q => !q.button_text)) {
    return true;
  }
  return false;
}

/**
 * Migrate form data to new button text structure
 * Adds button_text field to all questions that don't have it
 * Backwards compatible - old forms work unchanged
 *
 * @param {Object} formData - Form data to migrate
 * @returns {Object} Migrated form data with button_text fields
 */
export function migrateFormData(formData) {
  if (!formData || !formData.questions) {
    return formData;
  }

  const migratedQuestions = formData.questions.map(question => {
    // If question already has button_text, keep it
    if (question.button_text) {
      return question;
    }

    // Add default button_text configuration
    return {
      ...question,
      button_text: createDefaultButtonConfig()
    };
  });

  return {
    ...formData,
    questions: migratedQuestions
  };
}

/**
 * Apply migration if needed
 * Safe to call on every form load - only migrates if needed
 *
 * @param {Object} formData - Form data to potentially migrate
 * @returns {Object} Migrated form data or original if no migration needed
 */
export function autoMigrate(formData) {
  if (needsMigration(formData)) {
    console.log('[Button Text Migration] Migrating form data to new structure');
    return migrateFormData(formData);
  }
  return formData;
}

/**
 * Ensure a single question has button_text field
 * Used when creating new questions or updating existing ones
 *
 * @param {Object} question - Question to ensure has button_text
 * @returns {Object} Question with button_text field guaranteed
 */
export function ensureQuestionHasButtonText(question) {
  if (question.button_text) {
    return question;
  }

  return {
    ...question,
    button_text: createDefaultButtonConfig()
  };
}
