import express  from "express";
import diagnosesServices from "../Services/diagnosesServices";

const router = express.Router();

router.get("/", (_req, res)=>{
    try {
        const diagnoses = diagnosesServices.getAllDiagnoses();
        if(diagnoses){
            res.send(diagnoses)
        } else {
            res.status(400).send({error: "not found"})
        }
    } catch (error: any) {
        res.status(400).send({error: error.message});
    };
})

export default router;
