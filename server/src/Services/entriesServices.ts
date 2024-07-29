import { Entry, EntryWithoutId, Patient } from "../Types/types"
import patientServices from "./patientServices"

const {v4: uuid} = require("uuid")


const addEntry = (patient: Patient, entry: EntryWithoutId): Entry =>{
    const id = uuid();
    const newEntry: Entry = {
        id,
        ...entry,
    };

    patient?.entries.push(newEntry)

    return newEntry;
};

const get = (id: string): Entry[] | undefined =>{
    console.log("🚀 ~ get ~ patientId:", id)
    const patient = patientServices.findById(id);
    if(patient){
        return patient.entries
    } else{ 
        return undefined
    }
}

export default {addEntry, get};