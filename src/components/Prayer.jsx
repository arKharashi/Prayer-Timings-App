import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const Prayer = ({ name, time }) => {
  return (
    <>
      <Card sx={{ minWidth: 200, background: "#2f3e46", color: "white" }}>
        <CardContent>
          <h2>
            {name}
          </h2>
          <h2 variant="h5" component="div">
            {time}
          </h2>
        </CardContent>
      </Card>
    </>
  );
};

export default Prayer;
