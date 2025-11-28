import { ExperimentHistory } from '@/types/chemistry';

// Re-export for convenience
export type { ExperimentHistory };

const STORAGE_KEY = 'chemistry-experiment-history';

/**
 * Save experiment to localStorage
 */
export function saveExperiment(experiment: ExperimentHistory): void {
  try {
    const history = getHistory();
    history.unshift(experiment); // Add to beginning
    
    // Keep only last 50 experiments
    const trimmed = history.slice(0, 50);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save experiment:', error);
  }
}

/**
 * Get all experiments from localStorage
 */
export function getHistory(): ExperimentHistory[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as ExperimentHistory[];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

/**
 * Clear all experiment history
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

/**
 * Get a single experiment by ID
 */
export function getExperiment(id: string): ExperimentHistory | null {
  const history = getHistory();
  return history.find(exp => exp.id === id) || null;
}
