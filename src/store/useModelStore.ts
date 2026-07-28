import { create } from 'zustand';
import { computeOutputs, type ModelOutputs } from '../lib/model/calculations';
import { defaultHistoricalInputs, defaultScenarioInputs } from '../lib/model/defaultData';
import type { HistoricalInputs, ScenarioInputs } from '../lib/model/types';

const STORAGE_KEY = 'reablement-model-v1';

interface PersistedState {
  historical: HistoricalInputs;
  scenario: ScenarioInputs;
}

function loadPersisted(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

function persist(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (e.g. private browsing) — edits just won't survive a refresh.
  }
}

interface ModelStore {
  historical: HistoricalInputs;
  scenario: ScenarioInputs;
  outputs: ModelOutputs;
  setHistorical: (historical: HistoricalInputs) => void;
  setScenario: (scenario: ScenarioInputs) => void;
  resetScenarioToHistorical: () => void;
  importState: (state: PersistedState) => void;
}

const persisted = loadPersisted();
const initialHistorical = persisted?.historical ?? defaultHistoricalInputs;
const initialScenario = persisted?.scenario ?? defaultScenarioInputs;

export const useModelStore = create<ModelStore>((set, get) => ({
  historical: initialHistorical,
  scenario: initialScenario,
  outputs: computeOutputs(initialHistorical, initialScenario),

  setHistorical: (historical) => {
    const { scenario } = get();
    persist({ historical, scenario });
    set({ historical, outputs: computeOutputs(historical, scenario) });
  },

  setScenario: (scenario) => {
    const { historical } = get();
    persist({ historical, scenario });
    set({ scenario, outputs: computeOutputs(historical, scenario) });
  },

  resetScenarioToHistorical: () => {
    const { historical } = get();
    const scenario: ScenarioInputs = {
      demandPerWeek: historical.demandPerWeek,
      absenceTarget: historical.absenceTarget,
      utilisationTarget: historical.utilisationTarget,
      vacancyTarget: get().scenario.vacancyTarget,
      areaSplit: { ...historical.areaSplit },
      needProfile: {
        low: { ...historical.needProfile.low },
        medium: { ...historical.needProfile.medium },
        high: { ...historical.needProfile.high },
      },
      vacancyData: get().scenario.vacancyData,
    };
    persist({ historical, scenario });
    set({ scenario, outputs: computeOutputs(historical, scenario) });
  },

  importState: (state) => {
    persist(state);
    set({ ...state, outputs: computeOutputs(state.historical, state.scenario) });
  },
}));
