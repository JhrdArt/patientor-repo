import React from "react";
import { OccupationalHealthCareEntry } from "../../types";
import { Typography } from "@mui/material";

interface Props {
  entry: OccupationalHealthCareEntry;
}

export const Occupational: React.FC<Props> = ({ entry }) => {
  console.log(Object(entry));
  return (
    <>
      {entry.sickLeave ? (
        <Typography paragraph>
          Start day: {entry.sickLeave?.startDate}
        </Typography>
      ) : (
        ""
      )}
      {entry.sickLeave ? (
        <Typography paragraph>End day: {entry.sickLeave?.endDate}</Typography>
      ) : (
        ""
      )}
      <Typography paragraph>
        Employer Name: <em>{entry.employerName}</em>
      </Typography>
    </>
  );
};
