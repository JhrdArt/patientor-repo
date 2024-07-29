type UnionOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

export interface DiagnoseEntry {
    code: string,
    name: string,
    latin?: string
}

export interface BaseEntries {
    id: string,
    date: string,
    diagnosisCodes?: DiagnoseEntry["code"][],
    specialist?: string,
    description?: string,
    
}

export enum HealthCheckRating{
    "Healthy" = 0,
    "LowRisk" = 1,
    "HighRisk" = 2,
    "CriticalRisk" = 3
}

export const EntryTypes = [
    'HealthCheck',
    'Hospital',
    'OccupationalHealthcare',] as const;

export interface HealthCheckEntry extends BaseEntries {
    type: "HealthCheck",
    healthCheckRating: HealthCheckRating
}

export interface SickLeave {
    startDate: string,
    endDate: string
} 

export interface OccupationalHealthcareEntries extends BaseEntries {
    type: "OccupationalHealthcare",
    employerName: string,
    sickLeave?: SickLeave
}

export interface HospitalDischarge {
        date: string,
        criteria: string
}

export interface HospitalEntries extends BaseEntries {
    type: "Hospital",
    discharge: HospitalDischarge
}

export enum Gender {
    Male = "Male",
    Female = "Female",
    Other = "Other"
}

export type Entry = | HealthCheckEntry | HospitalEntries | OccupationalHealthcareEntries;

export interface Patient {
    id: string,
    name: string,
    dateOfBirth: string,
    ssn: string,
    occupation: string,
    gender: Gender,
    entries: Entry[]
}

export type PublicPatient = Omit<Patient, "entries" | "ssn">;
export type NonSensitivePatientEntries = Omit<Patient, "ssn">;
export type NewPatientEntry = Omit<Patient, "id">;

export type TypeSpecificEntry = UnionOmit<Entry, keyof Omit<BaseEntries, "type">>
export type EntryWithoutId = UnionOmit<Entry, "id">
