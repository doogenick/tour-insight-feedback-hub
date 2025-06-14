
import { ComprehensiveFeedback } from "../services/api/types";
import { Tour, Client } from "../services/api/types";

/**
 * Returns validation functions and error messages for the comprehensive feedback form.
 */
export function useComprehensiveFeedbackValidation(
  selectedTour: Tour | null,
  selectedClient: Client | null,
  formData: Partial<ComprehensiveFeedback>
) {
  // Validate first page (tour and client selection)
  function validatePage1(): { valid: boolean; message?: string } {
    if (!selectedTour || !selectedClient) {
      return { valid: false, message: "Tour and client must be selected first" };
    }
    return { valid: true };
  }

  // Validate email presence for final submission
  function requireClientEmail(): { valid: boolean; message?: string } {
    if (!formData.client_email || !formData.client_email.trim()) {
      return {
        valid: false,
        message: "Please provide your email address before submitting.",
      };
    }
    return { valid: true };
  }

  // Additional page 3 validation can be added here (e.g. signature etc.)

  return { validatePage1, requireClientEmail };
}

