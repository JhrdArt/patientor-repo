import { SyntheticEvent, useState } from "react";
import {
  Button,
  Container,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import {
  Diagnosis,
  EntryWithoutId,
  HealthCheckRating,
  Entry,
} from "../../types";
import { RootState } from "../../store";

interface Props {
  onSubmit: (values: EntryWithoutId) => Promise<Entry | undefined>;
}

interface HealthCheckRatingOptions {
  value: number;
  label: string;
}

const healthCheckRatingOptions: HealthCheckRatingOptions[] = Object.values(
  HealthCheckRating
)
  .filter((value) => typeof value === "number")
  .map((v) => ({
    value: v as number,
    label: HealthCheckRating[v as number],
  }));

export const PatientEntryForm = ({ onSubmit }: Props) => {
  const diagnoses = useSelector((state: RootState) => state.diagnoses);

  const [open, setOpen] = useState<boolean>(false);

  const [date, setDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [specialist, setSpecialist] = useState<string>("");

  const [diagnosisCodes, setDiagnosisCodes] = useState<
    Array<Diagnosis["code"]>
  >([]);
  console.log("🚀 ~ PatientEntryForm ~ diagnosisCodes:", diagnosisCodes);

  const [healthCheckRating, setHealthCheckRating] = useState(
    HealthCheckRating.Healthy
  );
  const [dischargeDate, setDischargeDate] = useState<string>("");
  const [criteriaDischarge, setCriteriaDischarge] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");
  const [entryOption, setEntryOption] = useState("");
  const [employerName, setEmployerName] = useState("");

  const onHealthCheckRating = (e: SelectChangeEvent<string>) => {
    e.preventDefault();
    const val = Number(e.target.value);
    const healthCheckRating = Object.values(HealthCheckRating);
    if (val && healthCheckRating.includes(val)) {
      setHealthCheckRating(val);
    }
  };

  const onDiagnosisCodeChange = (
    e: SelectChangeEvent<typeof diagnosisCodes>
  ) => {
    const value = e.target.value;
    typeof value === "string"
      ? setDiagnosisCodes(value.split(", "))
      : setDiagnosisCodes(value);
  };

  const addEntry = (e: SyntheticEvent) => {
    e.preventDefault();

    const baseEntry = {
      description,
      date,
      specialist,
      diagnosisCodes,
    };
    switch (entryOption) {
      case "HealthCheck":
        onSubmit({
          ...baseEntry,
          type: "HealthCheck",
          healthCheckRating,
        });
        break;
      case "Hospital":
        onSubmit({
          ...baseEntry,
          type: "Hospital",
          discharge: {
            date: dischargeDate,
            criteria: criteriaDischarge,
          },
        });
        break;
      case "OccupationalHealthcare":
        onSubmit({
          ...baseEntry,
          type: "OccupationalHealthcare",
          employerName: employerName,
          sickLeave:
            sickLeaveStart && sickLeaveEnd
              ? {
                  startDate: sickLeaveStart,
                  endDate: sickLeaveEnd,
                }
              : undefined,
        });
    }
  };

  return (
    <Container>
      {open ? (
        ""
      ) : (
        <Button
          variant="contained"
          onClick={() => setOpen(!open)}
          aria-label="add"
        >
          Add entries
        </Button>
      )}
      {open && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "20rem",
          }}
        >
          <Typography
            component="h5"
            variant="h5"
            style={{ marginBottom: "10px" }}
          >
            Add entry
          </Typography>
          <InputLabel>Entry Options</InputLabel>
          <Select
            label="Entry options"
            fullWidth
            value={entryOption}
            onChange={(e) => setEntryOption(e.target.value)}
          >
            <MenuItem value="HealthCheck" key="hospitalCheck">
              Health Check
            </MenuItem>
            <MenuItem value="Hospital" key="hospital">
              Hospital
            </MenuItem>
            <MenuItem value="OccupationalHealthcare" key="occupationalHealth">
              Occupational Health care
            </MenuItem>
          </Select>
          <form
            style={{
              flexDirection: "column",
              gap: "10px",
              marginBottom: "20px",
            }}
            onSubmit={addEntry}
          >
            <InputLabel style={{ marginTop: "10px" }} htmlFor="date">
              Date
            </InputLabel>
            <TextField
              type="date"
              value={date}
              onChange={({ target }) => setDate(target.value)}
            />

            <InputLabel style={{ marginTop: "10px" }} htmlFor="specialist">
              Specialist
            </InputLabel>
            <TextField
              label="specialist "
              type="text"
              value={specialist}
              onChange={({ target }) => setSpecialist(target.value)}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ".625rem",
              }}
            >
              {/* // ? diagnoses code */}
              <InputLabel style={{ marginTop: "10px" }} htmlFor="code">
                Diagnoses Codes
              </InputLabel>
              <Select
                label="Diagnosis code"
                multiple
                fullWidth
                value={diagnosisCodes}
                onChange={onDiagnosisCodeChange}
                input={<OutlinedInput label="Multiple Select" />}
              >
                {diagnoses.map((d) => (
                  <MenuItem key={d.code} value={d.code}>
                    {d.code} {d.name}
                  </MenuItem>
                ))}
              </Select>
              {/* <Button
                style={{ marginLeft: "10px", background: "green" }}
                variant="contained"
                onClick={addCode}
                type="button"
              >
                Add code
              </Button> */}
              {/* <Typography variant="body1">
                <em>Codes: </em> {diagnosisCodes.join(", ")}
              </Typography> */}
            </div>
            <InputLabel style={{ marginTop: "10px" }} htmlFor="description">
              Description
            </InputLabel>
            <TextField
              label="description  "
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {entryOption === "HealthCheck" && (
              <div>
                <InputLabel>Health check Rating</InputLabel>
                <Select
                  value={healthCheckRating.toString()}
                  fullWidth
                  onChange={onHealthCheckRating}
                >
                  {healthCheckRatingOptions.map((option) => (
                    <MenuItem key={option.label} value={option.value}>
                      {option?.label}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            )}
            {entryOption === "Hospital" && (
              <div>
                <InputLabel style={{ marginTop: "10px" }}>
                  Discharge Date
                </InputLabel>
                <TextField
                  type="date"
                  fullWidth
                  value={dischargeDate}
                  onChange={(e) => setDischargeDate(e.target.value)}
                />
                <InputLabel style={{ marginTop: "10px" }}>
                  Discharge Criteria
                </InputLabel>
                <TextField
                  label="discharge criteria"
                  fullWidth
                  value={criteriaDischarge}
                  onChange={(e) => setCriteriaDischarge(e.target.value)}
                />
              </div>
            )}

            {entryOption === "OccupationalHealthcare" && (
              <div>
                <InputLabel style={{ marginTop: "10px" }}>
                  Employer Name
                </InputLabel>
                <TextField
                  label="employer name"
                  fullWidth
                  value={employerName}
                  onChange={(e) => setEmployerName(e.target.value)}
                />
                <InputLabel style={{ marginTop: "10px" }}>
                  Sick leave:{" "}
                </InputLabel>
                <InputLabel style={{ marginTop: "10px" }}>
                  Sick date:{" "}
                </InputLabel>
                <TextField
                  type="date"
                  fullWidth
                  value={sickLeaveStart}
                  onChange={(e) => setSickLeaveStart(e.target.value)}
                />
                <InputLabel style={{ marginTop: "10px" }}>End Date</InputLabel>
                <TextField
                  type="date"
                  fullWidth
                  value={sickLeaveEnd}
                  onChange={(e) => setSickLeaveEnd(e.target.value)}
                />
              </div>
            )}
            <Grid item style={{ marginTop: ".8em" }}>
              <Button
                variant="contained"
                type="submit"
                aria-label="submit"
                style={{ float: "left" }}
              >
                Submit
              </Button>
              <Button
                onClick={() => setOpen(!open)}
                style={{ float: "right" }}
                color="secondary"
                variant="contained"
              >
                Close
              </Button>
            </Grid>
          </form>
        </div>
      )}
    </Container>
  );
};
