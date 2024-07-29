import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Patient } from "../types";


const initialState: Patient[] = [];

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    setPatients: (_state, action: PayloadAction<Patient[]>) => {
      return action.payload;
    }
  }
});

export const { setPatients } = patientSlice.actions;

export default patientSlice.reducer;
