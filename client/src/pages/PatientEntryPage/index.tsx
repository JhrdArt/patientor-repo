import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Entry, EntryWithoutId } from "../../types";
import { AppDispatch, RootState } from "../../store";
import { useEffect, useState } from "react";

import { Hospital } from "./Hospital";
import { HealthCheck } from "./HealthCheck";
import { Occupational } from "./Occupational";
//icons
import { PiGenderFemaleBold } from "react-icons/pi";
import { PiGenderMaleBold } from "react-icons/pi";
import { PiGenderNeuterBold } from "react-icons/pi";
import axios from "axios";
import { Container, List, Typography } from "@mui/material";
import { ListItem } from "@mui/material";
import patientServices from "../../services/patientServices";
import { PatientEntryForm } from "./PatientEntryForm";
import diagnosesServices from "../../services/diagnosesServices";
import { setDiagnoses } from "../../state/diagnosesReducer";

const assertNever = (value: never) => {
  throw new Error(`unhandled discriminate union member ${value}`);
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <Hospital entry={entry} />;
    case "HealthCheck":
      return <HealthCheck entry={entry} />;
    case "OccupationalHealthcare":
      return <Occupational entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const PatientEntryPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  console.log("🚀 ~ PatientPage ~ id:", id);
  const patients = useSelector((state: RootState) => state.patients);
  const patient = patients.find((p) => p.id === id);
  console.log("🚀 ~ PatientPage ~ patient:", patient);
  const diagnoses = useSelector((state: RootState) => state.diagnoses);
  console.log("🚀 ~ PatientEntryPage ~ diagnoses:", diagnoses);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const diagnoses = await diagnosesServices.get();
        dispatch(setDiagnoses(diagnoses));
      } catch (error) {
        console.error("Error fetching diagnoses" + error);
      }
    };
    fetchDiagnoses();
  }, [dispatch]);

  const style = {
    border: "1px solid black",
    marginTop: "10px",
    padding: "20px",
    gap: "20px",
  };
  const gender = patient?.gender;

  const genderIcon =
    gender === "male" ? (
      <PiGenderMaleBold />
    ) : gender === "female" ? (
      <PiGenderFemaleBold />
    ) : (
      <PiGenderNeuterBold />
    );

  const onSubmitEntry = async (entry: EntryWithoutId) => {
    try {
      if (patient) {
        const newEntry = await patientServices.addPatientEntry(
          patient.id,
          entry
        );
        [...patient.entries, newEntry];
        return newEntry;
      }
      return patient;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data && typeof error?.response.data === "string") {
          const message = error.response.data.replace(
            "Something went wrong. Error: ",
            ""
          );
          console.error(error.message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", error);
        setError("Unknown error");
      }
    }
  };

  return (
    <>
      <Container style={{ margin: "20px 0 20px 0" }}>
        <Typography color="warning">{error}</Typography>
        <Typography variant="h3" component="h3">
          Patient information
        </Typography>
        <PatientEntryForm onSubmit={onSubmitEntry} />
        <Typography style={{ marginTop: "30px" }} variant="h4" component="h4">
          {patient?.name} {genderIcon}
        </Typography>
        <Typography variant="h5" component="h5">
          {patient?.ssn}
        </Typography>
        <Typography variant="h6" component="h6">
          {patient?.occupation}
        </Typography>
      </Container>
      <Container style={style}>
        <Typography variant="h3" component="h3">
          Patient Entries
        </Typography>
        {patient?.entries.length !== 0 ? (
          patient?.entries.map((entry) => (
            <Container key={entry.id} style={style}>
              <Container>
                <Typography>
                  <strong>Entry date </strong>
                  {entry.date}
                </Typography>
                <Typography>Description: {entry.description}</Typography>
                {entry.diagnosisCodes?.map((code) => {
                  const diagnosisCode = diagnoses.find((d) => d.code === code);
                  const diagnosis = diagnosisCode
                    ? diagnosisCode.name
                    : "unknown diagnosis";
                  return (
                    <List key={code}>
                      <ListItem>
                        <Typography variant="caption">
                          {code} {diagnosis}
                        </Typography>
                      </ListItem>
                    </List>
                  );
                })}
                {Object.keys(diagnoses).length === 0 ? null : (
                  <EntryDetails entry={entry} />
                )}
              </Container>
              <Typography paragraph>
                Specialist: <strong>{entry.specialist}</strong>
              </Typography>
            </Container>
          ))
        ) : (
          <strong>no entries...</strong>
        )}
      </Container>
    </>
  );
};

export default PatientEntryPage;
