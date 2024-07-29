import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import { Diagnosis } from "../types";

const initialState: Diagnosis[] = [];


const diagnosisSlice = createSlice({
    name: "diagnoses",
    initialState,
    reducers:{
        setDiagnoses(_state, action: PayloadAction<Diagnosis[]>){
            return action.payload;
        }        
    }
    
});

export const {setDiagnoses} = diagnosisSlice.actions;

export default diagnosisSlice.reducer;