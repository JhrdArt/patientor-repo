import { useState, useEffect } from "react";
import {
  Box,
  Table,
  Button,
  TableHead,
  Typography,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material";

import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { Patient, PatientFormValues } from "../../types";

import { AppDispatch, RootState } from "../../store";
import { Link } from "react-router-dom";
import patientServices from "../../services/patientServices";
import HealthRatingBar from "../../components/HealthRatingBar";
import AddPatientModal from "./AddPatientModal";
import { setPatients } from "../../state/patientsReducer";

const PatientListPage = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const openModal = (): void => setModalOpen(true);
  const dispatch = useDispatch<AppDispatch>();
  const patients = useSelector((state: RootState) => state.patients);
  console.log("🚀 ~ PatientListPage ~ patients:", patients);
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patients: Patient[] = await patientServices.get();
        dispatch(setPatients(patients));
      } catch (error) {
        console.error("Failed fetching patients: " + error);
      }
    };
    fetchPatients();
  }, [dispatch]);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewPatient = async (values: PatientFormValues) => {
    try {
      await patientServices.addPatient(values);
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace(
            "Something went wrong. Error: ",
            ""
          );
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  return (
    <div className="App">
      <Box>
        <Typography align="center" variant="h6">
          Patient list
        </Typography>
      </Box>
      <Table style={{ marginBottom: "1em" }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Occupation</TableCell>
            <TableCell>Health Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(patients).map((patient: Patient) => (
            <TableRow key={patient.id}>
              <TableCell>
                <Link to={`/patients/${patient.id}`}>{patient.name}</Link>
              </TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>{patient.occupation}</TableCell>
              <TableCell>
                <HealthRatingBar showText={false} rating={1} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddPatientModal
        modalOpen={modalOpen}
        error={error}
        onClose={closeModal}
        onSubmit={submitNewPatient}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Patient
      </Button>
    </div>
  );
};

export default PatientListPage;
