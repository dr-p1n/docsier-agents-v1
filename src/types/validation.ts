import type { Deadline, DocumentClassificationResult } from './agents';

export interface ValidationResult {
  validation_status: 'validated' | 'warning' | 'error';
  confidence_score: number;
  feedback: string;
  verified_items?: string[];
  discrepancies?: Array<{
    field?: string;
    claim?: string;
    reality?: string;
    severity?: string;
  }>;
  missing_information?: string[];
  verified_deadlines?: unknown[];
  incorrect_deadlines?: unknown[];
  missed_deadlines?: unknown[];
}

export interface DeadlineWithValidation extends Deadline {
  validation?: ValidationResult;
}

export interface DocumentWithValidation extends DocumentClassificationResult {
  validation?: ValidationResult;
}
