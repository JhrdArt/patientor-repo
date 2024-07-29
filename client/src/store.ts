import {configureStore} from "@reduxjs/toolkit";
import patientsReducer from "./state/patientsReducer";
import diagnosesReducer from "./state/diagnosesReducer";

const store = configureStore({
    reducer: {
        patients: patientsReducer,
        diagnoses: diagnosesReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;