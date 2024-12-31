import { createSlice } from "@reduxjs/toolkit";

const testCompetitors = [
  {
    name: "Mark Zealey",
    boatClass: "SOLO",
    sailNumber: "2345",
  },
  {
    name: "Test a",
    boatClass: "SOLO",
    sailNumber: "1",
  },
  {
    name: "Test b",
    boatClass: "ILCA 7 / Laser",
    sailNumber: "212234",
    crew: "blah",
  },
  {
    name: "Test C",
    boatClass: "COMET DUO",
    sailNumber: "2356",
    crew: "Test Other",
  },
].map((competitor) => ({ ...competitor, id: crypto.randomUUID() }));

export const raceSlice = createSlice({
  name: "race",
  initialState: {
      competitors: testCompetitors,
      startTime: undefined,
      //competitors: [],
  },
  reducers: {
    addCompetitor: (state, action) => {
      // Filter to remove any blank rows
      state.competitors
        .filter(
          (competitor) =>
            !(
              competitor.name ||
              competitor.boatClass ||
              competitor.sailNumber ||
              competitor.crew
            ),
        )
        .forEach((blankRow) => state.competitors.splice(state.competitors.indexOf(blankRow), 1));

      state.competitors.push({ ...action.payload, id: crypto.randomUUID() });
    },
    updateCompetitor: (state, action) => {
      const index = state.competitors.findIndex((c) => c.id === action.payload.id);

      if (index !== -1) {
        state.competitors[index] = action.payload;
      }
    },
    deleteCompetitor: (state, action) => {
      const index = state.competitors.findIndex((c) => c.id === action.payload.id);

      if (index !== -1) {
        state.competitors.splice(index, 1);
      }
    },
    startRaceTimer: (state, action) => {
      state.startTime = action.payload;
    },
    resetRaceTimer: (state, action) => {
      state.startTime = undefined;
    },
  },
});

export const { addCompetitor, updateCompetitor, deleteCompetitor, startRaceTimer, resetRaceTimer } =
  raceSlice.actions;

export default raceSlice.reducer;
