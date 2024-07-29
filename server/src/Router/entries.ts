import express, {Request, Response} from "express";

import { toNewEntry } from "../Utils/utils";
import entriesServices from "../Services/entriesServices";
import patientServices from "../Services/patientServices";

const router = express.Router();

router.get("/:id/entries", (_req: Request<{id: string}>, res: Response)=>{
    const id = _req.params.id;
    console.log("🚀 ~ router.get ~ id:", id)
    try {
        const entries = entriesServices.get(id) ;
        if(entries){
            res.send(entries);
        } else{ 
            res.status(400).send("Patient not found");
        }
    } catch (error: any) {
        res.status(400).send({error: error.message});
    }
    
})

router.post("/:id/entries", (req: Request<{id: string}>, res)=>{
    try {  
        const patient = patientServices.findById(req.params.id)
        if(patient === undefined){
            res.status(400).send("Patient not found")
            return;
        }
        const newEntry = toNewEntry(req.body);
        const addEntry = entriesServices.addEntry(patient, newEntry);
        res.json(addEntry);       

    } catch (error) {
        res.status(400).json({
            error: error instanceof Error? error.message: `unknown error`
        });
    }
})

export default router