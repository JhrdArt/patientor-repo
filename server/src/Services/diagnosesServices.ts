import { DiagnoseEntry } from "../Types/types";
import diagnoses from "../../data/diagnoses";

const getAllDiagnoses = () : DiagnoseEntry[]=>{
    return diagnoses;
};

export default {getAllDiagnoses};