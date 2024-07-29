import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Entry, EntryWithoutId, Patient, PatientFormValues } from "../types";

const get = async () =>{
    const {data} = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);
    console.log("🚀 ~ get ~ data:", data);
    return data;
};

const addPatient = async (object: PatientFormValues) =>{
    const {data} = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);
    console.log("🚀 ~ addPatient ~ data:", data);
    return data;
};

const addPatientEntry = async (patientId: string, entry: EntryWithoutId) =>{
    const {data} = await axios.post<Entry>(`${apiBaseUrl}/patients/${patientId}/entries`, entry);
    console.log("🚀 ~ addPatientEntry ~ data:", data);
    return data;
};

export default {get, addPatient, addPatientEntry};