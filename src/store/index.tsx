import { configureStore } from "@reduxjs/toolkit";
import timeEntriesSlice from "./TimeEntriesSlice";

const store = configureStore({
  reducer: { timeEntry: timeEntriesSlice.reducer },
});

export default store;
