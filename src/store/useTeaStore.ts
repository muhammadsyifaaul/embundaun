/**
 * useTeaStore — single source of truth for:
 *   • activeTea    : which of the 4 brews is selected
 *   • lighting     : 'morning' | 'dusk'
 *   • liquidColor  : hex / steamDensity for the 3D liquid mesh
 *   • cupTarget    : {x,y,z,rotX,rotY} scroll-driven cup position
 *                    written by ScrollChoreographer, lerped in SceneContainer
 *
 * AGENTS.md guardrail — zero state mutations inside useFrame.
 * The 3D scene reads values via .subscribe() into useRef only.
 */

import { create } from "zustand";

export type LightingMode = "morning" | "dusk";

export interface TeaEntry {
  id: string;
  liquidColor:  string;   // hex
  steamDensity: number;   // 0–1
}

export interface CupTarget {
  x:    number;
  y:    number;
  z:    number;
  rotX: number;
  rotY: number;
}

export const DEFAULT_CUP_TARGET: CupTarget = {
  x: 1.45, y: -0.55, z: 0, rotX: 0, rotY: 0,
};

export const TEA_ENTRIES: TeaEntry[] = [
  { id: "sencha",  liquidColor: "#4C7A24", steamDensity: 0.85 },
  { id: "jasmine", liquidColor: "#7C9A23", steamDensity: 0.70 },
  { id: "peony",   liquidColor: "#B8862D", steamDensity: 0.55 },
  { id: "hojicha", liquidColor: "#6E3210", steamDensity: 1.00 },
];

interface TeaState {
  activeTea:    TeaEntry;
  lighting:     LightingMode;
  cupTarget:    CupTarget;
  craftActive:  boolean;
  saucerSplit:  number;
  setActiveTea:   (id: string) => void;
  setLighting:    (mode: LightingMode) => void;
  setCupTarget:   (t: CupTarget) => void;
  setCraftActive: (v: boolean) => void;
  setSaucerSplit: (v: number) => void;
}

export const useTeaStore = create<TeaState>((set) => ({
  activeTea:   TEA_ENTRIES[0],
  lighting:    "morning",
  cupTarget:   DEFAULT_CUP_TARGET,
  craftActive: false,
  saucerSplit: 0,

  setActiveTea:   (id) => {
    const entry = TEA_ENTRIES.find((t) => t.id === id) ?? TEA_ENTRIES[0];
    set({ activeTea: entry });
  },
  setLighting:    (mode) => set({ lighting: mode }),
  setCupTarget:   (t)    => set({ cupTarget: t }),
  setCraftActive: (v)    => set({ craftActive: v }),
  setSaucerSplit: (v)    => set({ saucerSplit: v }),
}));
