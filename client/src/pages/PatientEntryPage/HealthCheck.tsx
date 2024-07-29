import React from "react";
import { HealthCheckEntry } from "../../types";
import { FaHeart } from "react-icons/fa";
import { Container, Typography } from "@mui/material";

interface Props {
  entry: HealthCheckEntry;
}

export const HealthCheck: React.FC<Props> = ({ entry }) => {
  const healthCheckRating = entry.healthCheckRating;
  if (healthCheckRating === 0) {
    return (
      <Container>
        <Typography>Health rating:</Typography>{" "}
        <FaHeart style={{ color: "green" }} />
      </Container>
    );
  } else if (healthCheckRating === 1) {
    return (
      <Container>
        <Typography>Health rating:</Typography>
        <FaHeart style={{ color: "skyblue" }} />
      </Container>
    );
  } else if (healthCheckRating === 2) {
    return (
      <Container>
        <Typography>Health rating:</Typography>
        <FaHeart style={{ color: "orange" }} />
      </Container>
    );
  } else {
    return (
      <Container style={{ display: "flex", flexDirection: "row" }}>
        <Typography>Health rating:</Typography>

        <FaHeart style={{ color: "red" }} />
      </Container>
    );
  }
};
