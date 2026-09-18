"use client";

import { useCallback, useMemo, useReducer } from "react";

import { TERRITORY_ADJACENCY } from "../geo/territoryGeometry";
import { createHistoryEvent } from "./history";
import { generateKingdomName } from "./names";
import { INITIAL_TERRITORIES } from "./territories";
import type { HistoryEvent, Kingdom, KingdomId, TerritoryId, TerritoryState } from "./types";

export interface GameState {
  territories: Record<TerritoryId, TerritoryState>;
  kingdoms: Record<KingdomId, Kingdom>;
  selectedTerritoryId: TerritoryId | null;
  history: HistoryEvent[];
  currentYear: number;
}

type Action =
  | { type: "SELECT_TERRITORY"; id: TerritoryId | null }
  | { type: "DEVELOP_TERRITORY"; id: TerritoryId }
  | { type: "FORM_KINGDOM"; territoryId: TerritoryId }
  | { type: "ANNEX_TERRITORY"; kingdomId: KingdomId; territoryId: TerritoryId }
  | { type: "PROPOSE_TRADE"; kingdomIdA: KingdomId; kingdomIdB: KingdomId };

const KINGDOM_COLORS = [
  "#C9A24B", // gold
  "#5B8DB8", // steel blue
  "#8F5B7A", // muted plum
  "#6E8F5B", // muted green
  "#B8705B", // clay
  "#5B7A8F", // slate
  "#A3915B", // bronze
  "#7A5B8F" // violet
];

function developmentEventText(territory: TerritoryState): string {
  const newLevel = territory.development;
  if (newLevel === 2) {
    if (territory.resources.some((r) => r === "iron" || r === "ore" || r === "stone")) {
      return `${territory.name} developed its first mine.`;
    }
    if (territory.resources.includes("timber")) {
      return `${territory.name} opened its first sawmill.`;
    }
    if (territory.resources.includes("fish")) {
      return `${territory.name} built its first docks.`;
    }
    if (territory.resources.includes("grain")) {
      return `${territory.name} expanded its farmland.`;
    }
    return `${territory.name} began developing its infrastructure.`;
  }
  if (newLevel === 5) return `${territory.name} reached its full potential — Level 5 development.`;
  return `${territory.name}'s development reached Level ${newLevel}.`;
}

function initialState(): GameState {
  return {
    territories: INITIAL_TERRITORIES,
    kingdoms: {},
    selectedTerritoryId: null,
    history: [createHistoryEvent(0, "The chronicles of Echelon begin.")],
    currentYear: 1
  };
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SELECT_TERRITORY": {
      return { ...state, selectedTerritoryId: action.id };
    }

    case "DEVELOP_TERRITORY": {
      const territory = state.territories[action.id];
      if (!territory || territory.development >= 5) return state;

      const updated: TerritoryState = {
        ...territory,
        development: territory.development + 1,
        infrastructure: Math.min(100, territory.infrastructure + 10 + Math.round(Math.random() * 8)),
        population: Math.round(territory.population * (1.04 + Math.random() * 0.06))
      };

      return {
        ...state,
        territories: { ...state.territories, [action.id]: updated },
        history: [...state.history, createHistoryEvent(state.currentYear, developmentEventText(updated))],
        currentYear: state.currentYear + 1
      };
    }

    case "FORM_KINGDOM": {
      const territory = state.territories[action.territoryId];
      if (!territory || territory.kingdomId) return state;

      const kingdomId = `kingdom-${action.territoryId}-${state.currentYear}`;
      const name = generateKingdomName(territory.name, action.territoryId);
      const color = KINGDOM_COLORS[Object.keys(state.kingdoms).length % KINGDOM_COLORS.length];

      const kingdom: Kingdom = {
        id: kingdomId,
        name,
        color,
        capitalTerritoryId: action.territoryId,
        memberTerritoryIds: [action.territoryId],
        foundedYear: state.currentYear,
        tradePartners: []
      };

      const eventText =
        name === territory.name
          ? `The Kingdom of ${name} was established.`
          : `${name} was established, with ${territory.name} as its capital.`;

      return {
        ...state,
        kingdoms: { ...state.kingdoms, [kingdomId]: kingdom },
        territories: {
          ...state.territories,
          [action.territoryId]: { ...territory, kingdomId }
        },
        history: [...state.history, createHistoryEvent(state.currentYear, eventText)],
        currentYear: state.currentYear + 1
      };
    }

    case "ANNEX_TERRITORY": {
      const kingdom = state.kingdoms[action.kingdomId];
      const territory = state.territories[action.territoryId];
      if (!kingdom || !territory || territory.kingdomId) return state;

      const isAdjacent = kingdom.memberTerritoryIds.some((memberId) =>
        TERRITORY_ADJACENCY[memberId]?.includes(action.territoryId)
      );
      if (!isAdjacent) return state;

      const updatedKingdom: Kingdom = {
        ...kingdom,
        memberTerritoryIds: [...kingdom.memberTerritoryIds, action.territoryId]
      };

      return {
        ...state,
        kingdoms: { ...state.kingdoms, [action.kingdomId]: updatedKingdom },
        territories: {
          ...state.territories,
          [action.territoryId]: { ...territory, kingdomId: action.kingdomId }
        },
        history: [
          ...state.history,
          createHistoryEvent(state.currentYear, `${kingdom.name} annexed ${territory.name}.`)
        ],
        currentYear: state.currentYear + 1
      };
    }

    case "PROPOSE_TRADE": {
      const kingdomA = state.kingdoms[action.kingdomIdA];
      const kingdomB = state.kingdoms[action.kingdomIdB];
      if (!kingdomA || !kingdomB || kingdomA.id === kingdomB.id) return state;
      if (kingdomA.tradePartners.includes(kingdomB.id)) return state;

      return {
        ...state,
        kingdoms: {
          ...state.kingdoms,
          [kingdomA.id]: { ...kingdomA, tradePartners: [...kingdomA.tradePartners, kingdomB.id] },
          [kingdomB.id]: { ...kingdomB, tradePartners: [...kingdomB.tradePartners, kingdomA.id] }
        },
        history: [
          ...state.history,
          createHistoryEvent(
            state.currentYear,
            `${kingdomA.name} signed a trade agreement with ${kingdomB.name}.`
          )
        ],
        currentYear: state.currentYear + 1
      };
    }

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const selectTerritory = useCallback(
    (id: TerritoryId | null) => dispatch({ type: "SELECT_TERRITORY", id }),
    []
  );
  const developTerritory = useCallback(
    (id: TerritoryId) => dispatch({ type: "DEVELOP_TERRITORY", id }),
    []
  );
  const formKingdom = useCallback(
    (territoryId: TerritoryId) => dispatch({ type: "FORM_KINGDOM", territoryId }),
    []
  );
  const annexTerritory = useCallback(
    (kingdomId: KingdomId, territoryId: TerritoryId) =>
      dispatch({ type: "ANNEX_TERRITORY", kingdomId, territoryId }),
    []
  );
  const proposeTrade = useCallback(
    (kingdomIdA: KingdomId, kingdomIdB: KingdomId) =>
      dispatch({ type: "PROPOSE_TRADE", kingdomIdA, kingdomIdB }),
    []
  );

  const selectedTerritory =
    state.selectedTerritoryId !== null ? state.territories[state.selectedTerritoryId] : null;

  const annexableNeighbors = useMemo(() => {
    if (!selectedTerritory?.kingdomId) return [];
    const kingdom = state.kingdoms[selectedTerritory.kingdomId];
    if (!kingdom) return [];
    const neighborIds = new Set<TerritoryId>();
    for (const memberId of kingdom.memberTerritoryIds) {
      for (const neighborId of TERRITORY_ADJACENCY[memberId] ?? []) {
        if (!state.territories[neighborId]?.kingdomId) neighborIds.add(neighborId);
      }
    }
    return Array.from(neighborIds);
  }, [selectedTerritory, state.kingdoms, state.territories]);

  return {
    state,
    selectedTerritory,
    annexableNeighbors,
    selectTerritory,
    developTerritory,
    formKingdom,
    annexTerritory,
    proposeTrade
  };
}
