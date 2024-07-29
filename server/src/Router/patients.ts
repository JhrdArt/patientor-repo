import patientServices from "../Services/patientServices";
import express from "express"
import { toNewPatientEntry } from "../Utils/utils";


const router = express.Router();

router.get("/", (_req, res)=>{
   try {
      res.send(patientServices.getNonSensitivePatients())
   } catch (error: any) {
      res.status(400).send({error: error.message})
   }
})

router.post("/", (req, res)=>{
   const newPatientEntry = toNewPatientEntry(req.body);
   console.log("🚀 ~ router.post ~ newPatientEntry:", newPatientEntry)
   try {
      const patient = patientServices.addPatient(newPatientEntry);

      if(patient){
         res.send(patient);
      } else {
         res.status(400).send();
      };
   } catch (error: any) {
      res.status(400).send({error: error.message})
   };
});

router.get("/:id", (_req, res)=>{
   try {
      const {id} = _req.params;
      const patient = patientServices.getPatient(id);

      if(patient){
         res.send(patient)
      } else {
         res.status(400).send({error: "Patient not found"})
      }
   } catch (error: any) {
      res.status(400).send({error: error.message})
   };
});

export default router;