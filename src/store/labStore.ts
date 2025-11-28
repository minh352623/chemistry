import { create } from 'zustand';
import { Chemical, ChemicalInBeaker, BeakerState, Reaction, ExperimentHistory, VisualEffects } from '@/types/chemistry';
import { reactionEngine } from '@/engine/reactionEngine';
import { saveExperiment } from '@/utils/localStorage';
import { generateId } from '@/utils/chemistryHelpers';

interface LabStore {
  // State
  chemicalsInBeaker: ChemicalInBeaker[];
  beakerState: BeakerState;
  currentReaction: Reaction | null;
  isHeated: boolean;
  isStirred: boolean;
  
  // Actions
  addChemical: (chemical: Chemical) => void;
  removeChemical: (chemicalId: string) => void;
  mix: () => void;
  toggleHeat: () => void;
  toggleStir: () => void;
  reset: () => void;
  updateBeakerEffects: (effects: VisualEffects) => void;
}

const defaultBeakerState: BeakerState = {
  chemicals: [],
  color: '#E0F2FE', // Light blue water
  temperature: 25, // Room temperature
  volume: 20,
  activeEffects: {
    bubbles: 'none',
    temperatureChange: 0
  },
  isHeated: false,
  isStirred: false
};

export const useLabStore = create<LabStore>((set, get) => ({
  chemicalsInBeaker: [],
  beakerState: defaultBeakerState,
  currentReaction: null,
  isHeated: false,
  isStirred: false,

  addChemical: (chemical: Chemical) => {
    const existing = get().chemicalsInBeaker.find(
      c => c.chemical.id === chemical.id
    );

    if (existing) {
      // Increase amount if already present
      set(state => ({
        chemicalsInBeaker: state.chemicalsInBeaker.map(c =>
          c.chemical.id === chemical.id
            ? { ...c, amount: c.amount + 1 }
            : c
        )
      }));
    } else {
      // Add new chemical
      set(state => ({
        chemicalsInBeaker: [
          ...state.chemicalsInBeaker,
          {
            chemical,
            amount: 1,
            addedAt: Date.now()
          }
        ]
      }));
    }

    // Update beaker color based on current chemicals
    const chemicalIds = get().chemicalsInBeaker.map(c => c.chemical.id);
    const newColor = reactionEngine.blendColors([...chemicalIds, chemical.id]);
    
    set(state => ({
      beakerState: {
        ...state.beakerState,
        color: newColor,
        volume: Math.min(100, state.beakerState.volume + 10)
      }
    }));
  },

  removeChemical: (chemicalId: string) => {
    set(state => ({
      chemicalsInBeaker: state.chemicalsInBeaker.filter(
        c => c.chemical.id !== chemicalId
      )
    }));

    // Update color
    const chemicalIds = get().chemicalsInBeaker
      .filter(c => c.chemical.id !== chemicalId)
      .map(c => c.chemical.id);
    
    const newColor = chemicalIds.length > 0 
      ? reactionEngine.blendColors(chemicalIds)
      : '#E0F2FE';

    set(state => ({
      beakerState: {
        ...state.beakerState,
        color: newColor,
        volume: Math.max(0, state.beakerState.volume - 10)
      }
    }));
  },

  mix: () => {
    const { chemicalsInBeaker, isHeated, isStirred } = get();
    const chemicalIds = chemicalsInBeaker.map(c => c.chemical.id);

    if (chemicalIds.length < 2) {
      return;
    }

    const result = reactionEngine.evaluateReaction(chemicalIds, {
      heated: isHeated,
      stirred: isStirred
    });

    if (result.success && result.reaction) {
      // Reaction occurred!
      const reaction = result.reaction;
      
      // Update beaker state with reaction effects
      set(state => ({
        currentReaction: reaction,
        beakerState: {
          ...state.beakerState,
          color: reaction.effects.color || state.beakerState.color,
          temperature: state.beakerState.temperature + (reaction.effects.temperatureChange || 0),
          activeEffects: reaction.effects
        }
      }));

      // Save to history
      const experiment: ExperimentHistory = {
        id: generateId(),
        timestamp: Date.now(),
        reactants: chemicalsInBeaker.map(c => ({
          name: c.chemical.name,
          formula: c.chemical.formula
        })),
        reaction,
        result: {
          success: true,
          message: result.message
        }
      };

      saveExperiment(experiment);

      // Auto-reset after 5 seconds (optional)
      // setTimeout(() => get().reset(), 5000);
    } else {
      // No reaction
      const defaultEffects = reactionEngine.getDefaultEffects(chemicalIds);
      set(state => ({
        currentReaction: null,
        beakerState: {
          ...state.beakerState,
          activeEffects: defaultEffects
        }
      }));

      // Still save to history
      const experiment: ExperimentHistory = {
        id: generateId(),
        timestamp: Date.now(),
        reactants: chemicalsInBeaker.map(c => ({
          name: c.chemical.name,
          formula: c.chemical.formula
        })),
        reaction: null,
        result: {
          success: false,
          message: result.message
        }
      };

      saveExperiment(experiment);
    }
  },

  toggleHeat: () => {
    set(state => {
      const newHeated = !state.isHeated;
      return {
        isHeated: newHeated,
        beakerState: {
          ...state.beakerState,
          isHeated: newHeated,
          temperature: newHeated 
            ? state.beakerState.temperature + 20 
            : 25 // Reset to room temp
        }
      };
    });
  },

  toggleStir: () => {
    set(state => ({
      isStirred: !state.isStirred,
      beakerState: {
        ...state.beakerState,
        isStirred: !state.isStirred
      }
    }));
  },

  reset: () => {
    set({
      chemicalsInBeaker: [],
      beakerState: defaultBeakerState,
      currentReaction: null,
      isHeated: false,
      isStirred: false
    });
  },

  updateBeakerEffects: (effects: VisualEffects) => {
    set(state => ({
      beakerState: {
        ...state.beakerState,
        activeEffects: effects
      }
    }));
  }
}));
