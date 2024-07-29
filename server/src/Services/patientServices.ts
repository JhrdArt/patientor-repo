import { NewPatientEntry, NonSensitivePatientEntries, Patient } from "../Types/types";
import allPatients from "../../data/patients"; //todos los pacientes en la db

const {v1 : uuid} = require("uuid");

const patients : Patient[] = allPatients.map(({name, gender, ssn, dateOfBirth, occupation, entries, id})=>{
    return {
        id,
        name,
        ssn,
        dateOfBirth, 
        gender,
        occupation,
        entries
    };
});

const getAllPatients = (): Patient[]=>{
    return patients;
};

const findById = (id: string): Patient | undefined => {
    return patients.find((p) => p.id === id);
  };

const getNonSensitivePatients = () : NonSensitivePatientEntries[] =>{
    return patients.map(({id, name, gender, dateOfBirth, occupation, entries})=>{
        return {
            id, name, gender, dateOfBirth, occupation, entries
        };
    });
};

const addPatient = (entry : NewPatientEntry): Patient =>{
    const id = uuid();
    const newPatient = {
        id,
        ...entry
    };
    console.log("🚀 ~ addPatient ~ newPatient:", newPatient)
    patients.push(newPatient);

    return newPatient;
};

const getPatient = (id: string): Patient | undefined=> {
    const patient = patients.find(p => p.id === id);

    return patient;
};

export default {getAllPatients, getNonSensitivePatients, addPatient, getPatient, findById};