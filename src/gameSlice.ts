import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Resources {
  air: number;
  metal: number;
  energy: number;
}

interface GameState {
  resources: Resources;
  lastTick: number;
}

const initialState: GameState = {
  resources: {
    air: 100,
    metal: 0,
    energy: 50,
  },
  lastTick: Date.now(),
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    // Tick action for game loop
    tick: (state, action: PayloadAction<number>) => {
      const deltaTime = action.payload;
      // Decrease air over time
      state.resources.air = Math.max(
        0,
        state.resources.air - (deltaTime / 1000) * 2,
      );
      state.lastTick = Date.now();
    },

    // Add resources
    addResource: (
      state,
      action: PayloadAction<{ resource: keyof Resources; amount: number }>,
    ) => {
      const { resource, amount } = action.payload;
      state.resources[resource] += amount;
    },

    // Consume resources (returns success via separate action or check before dispatch)
    consumeResource: (
      state,
      action: PayloadAction<{ resource: keyof Resources; amount: number }>,
    ) => {
      const { resource, amount } = action.payload;
      if (state.resources[resource] >= amount) {
        state.resources[resource] -= amount;
      }
    },

    // Set resource directly (useful for debugging)
    setResource: (
      state,
      action: PayloadAction<{ resource: keyof Resources; amount: number }>,
    ) => {
      const { resource, amount } = action.payload;
      state.resources[resource] = amount;
    },

    // Reset game state
    resetGame: () => initialState,
  },
});

export const { tick, addResource, consumeResource, setResource, resetGame } =
  gameSlice.actions;
export default gameSlice.reducer;
