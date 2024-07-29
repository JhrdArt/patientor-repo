import React from "react";
import { HospitalEntry } from "../../types";
import { Typography } from "@mui/material";

interface Props {
  entry: HospitalEntry;
}

export const Hospital: React.FC<Props> = ({ entry }) => {
  return (
    <>
      <Typography paragraph>
        Discharge: {entry.discharge ? entry.discharge.criteria : ""}
      </Typography>
      <Typography paragraph>Discharge date: {entry.discharge.date}</Typography>
    </>
  );
};
