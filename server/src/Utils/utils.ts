import { Entry, Gender, NewPatientEntry, HospitalDischarge, HealthCheckRating, SickLeave,EntryTypes, TypeSpecificEntry, EntryWithoutId } from "../Types/types";

const isString = (text: unknown): text is string =>{
    return typeof text === "string";
};

const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

const isArray = (arg: unknown): arg is unknown[] => {
    return Array.isArray(arg);
};


const isUndefinedOrNull = (arg: unknown): arg is undefined | null =>{
    return arg === "undefined" || arg === "null"
}

const parseName = (name: unknown): string =>{
    if(!name || !isString(name)){
        throw new Error(`Incorrect or missing name: ${name}`);
    }
    return name;
};

const isDate = (date: any): boolean =>{
    return Boolean(Date.parse(date));
};

const isObject = (arg: unknown): arg is object => {
    return typeof arg === 'object' && arg !== null;
};

const parseString = (arg: unknown): string =>{
    if(!isString(arg)){
        throw new Error(`Must be a string`)
    }

    return arg
}

const parseDate = (date: any): string =>{
    if(!date || !isDate(date)){
        throw new Error(`Incorrect or missing date: ${date}`);
    }
    return date;
};

const parseSsn = (ssn: any): string =>{
    if(!ssn || !isString(ssn)){
        throw new Error(`Incorrect or missing ssn: ${ssn}`);
    }
    
    return ssn;
};

const parseOccupation = (occupation: unknown): string =>{
    if(!occupation || !isString(occupation)){
        throw new Error(`Incorrect or missing occupation: ${occupation}`);
    }
    return occupation;
};

const capitalizeFirst = (str: string): string=>{
    return str[0].toUpperCase() + str.slice(1);
};

const isGender = (param: any): param is Gender =>{
    return isString(param) && capitalizeFirst(param) in Gender;
};

const parseGender = (gender: unknown): Gender =>{
    if(!gender || !isGender(gender)){
        throw new Error(`Incorrect or missing gender: ${gender}`);
    }
    return gender;
};

const isHealthCheckRating = (arg: unknown): arg is HealthCheckRating=>{
    const enumValues = Object.values(HealthCheckRating);
    console.log(enumValues.slice(enumValues.length / 2).includes(Number(arg)))
    return enumValues.slice(enumValues.length / 2).includes(Number(arg))
}

const isHospitalDischarge = (arg: unknown): arg is HospitalDischarge =>{
    return (
        isObject(arg) &&
        "date" in arg &&
        isString(arg.date) &&
        isDate(arg.date) &&
        "criteria" in arg &&
        isString(arg.criteria)
    );
};

const isSickLeave = (arg: unknown): arg is SickLeave=>{
    return (
        isObject(arg) &&
        "startDate" in arg &&
        isString(arg.startDate) &&
        isDate(arg.startDate) &&
        "endDate" in arg &&
        isString(arg.endDate) &&
        isDate(arg.endDate) 
    );
};

const isEntry = (arg: unknown): arg is Entry =>{
    return (
        isObject(arg) &&
        "type" in arg &&
        isString(arg.type) &&
        EntryTypes.includes(arg.type as typeof EntryTypes[number])
    );
};

const parseDiagnosisCode = (arg: unknown): Entry["diagnosisCodes"]=>{
    if(!isArray(arg) || !arg.every((code): code is string => isString(code))){
        throw new Error(`Diagnosis codes must be a strings`)
    }
    return arg;
};

const parseHealthCheRating = (rating: unknown): HealthCheckRating =>{
    if(!isHealthCheckRating(rating)){
        throw new Error(`An error ocurred whit Check rating: must be a number to accepted range`)
    }
    return Number(rating);
};

const parseHospitalDischarge = (hospitalDischarge: HospitalDischarge): HospitalDischarge =>{
    if(!isHospitalDischarge(hospitalDischarge)){
        throw new Error(`Hospital discharge must conform to its type`);
    }
    return {
        date: parseDate(hospitalDischarge.date),
        criteria: parseString(hospitalDischarge.criteria)
    }
}

const parseSickLeave = (arg: unknown): SickLeave =>{
    if(!isSickLeave(arg)){
        throw new Error("Sick leave must be conform to its type");
    }

    return {
        startDate: parseDate(arg.startDate),
        endDate: parseDate(arg.endDate)
    };
};

const parseTypeSpecificEntryProperties = (entry: Entry): TypeSpecificEntry =>{
    switch(entry.type){
        case "HealthCheck":
            return {
                type: entry.type,
                healthCheckRating: parseHealthCheRating(entry.healthCheckRating),
            };
        case "OccupationalHealthcare":
            return {
                type: entry.type,
                employerName: parseString(entry.employerName),
                ...((): object =>
                    "sickLeave" in entry ? {sickLeave: parseSickLeave(entry.sickLeave)}
                    : {})()
            };
        case "Hospital":
            return {
                type: entry.type,
                discharge: parseHospitalDischarge(entry.discharge)
            }
        default: 
        return assertNever(entry)        
    };
};

export const parseEntries = (entries: unknown): Entry[]=>{
    if(isUndefinedOrNull(entries)) return [];

    if(!isArray(entries)){
        throw new Error(`Entries must be an array`);
    };
    if(!entries.every((entry): entry is Entry => isEntry(entry))){
        throw new Error("Each entry must conform to the Entry type");
    };

    return entries;
};

export const toNewPatientEntry = (object: unknown): NewPatientEntry =>{
    if(!object || typeof object !== "object"){
        throw new Error(`Incorrect or missing data`);
    }

    if("name" in object && "dateOfBirth" in object && "ssn" in object && "occupation" in object && "gender" in object && "entries" in object){
        const newEntry : NewPatientEntry = {
            name: parseName(object.name),
            dateOfBirth: parseDate(object.dateOfBirth),
            ssn: parseSsn(object.ssn),
            occupation: parseOccupation(object.occupation),
            gender: parseGender(object.gender),
            entries: parseEntries(object.entries)
        };

        return newEntry;
    } 

    throw new Error(`Incorrect data or missing values in object`);
};

export const toNewEntry = (entry: Record<string, unknown>): EntryWithoutId =>{
    if(!isEntry(entry)){
        throw new Error("Data must conform to the Entry type");
    };

    return {
        description: parseString(entry.description),
        date: parseDate(entry.date),
        specialist: parseString(entry.specialist),
        ...((): object =>
            "diagnosisCodes" in entry
            ? {diagnosesCodes: parseDiagnosisCode(entry.diagnosisCodes)}
            : {})(),
        ...parseTypeSpecificEntryProperties(entry)
    };
};

