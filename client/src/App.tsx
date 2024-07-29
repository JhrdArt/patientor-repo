import { useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container, Typography } from "@mui/material";

import { apiBaseUrl } from "./constants";
import PatientListPage from "./pages/PatientListPage";
import PatientEntryPage from "./pages/PatientEntryPage";

const App = () => {
  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);
    // const fetchPatientList = async () => {
    //   const patients = await patientService.getAll();
    //   setPatients(patients);
    // };
    // void fetchPatientList();
  }, []);

  return (
    <div className="App">
      <Router>
        <Container>
          <Typography
            variant="h3"
            style={{ marginBottom: "0.5em", marginTop: "0.5em" }}
          >
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider hidden />
          <Routes>
            <Route path="/" element={<PatientListPage />} />
            <Route path="/patients/:id" element={<PatientEntryPage />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
