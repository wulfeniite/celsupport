import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import CancelIcon from "@mui/icons-material/Cancel";
import Backdrop from "@mui/material/Backdrop";
import { TextField, Box, Grid, Button } from "@mui/material";

import { createIssue } from "../../../API";

export default function CreateIssueCard(props) {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formInput = new FormData(event.currentTarget);

    const title = formInput.get("title");
    const description = formInput.get("description");
    const userId = props.userId;

    const data = await createIssue(userId, title, description);

    if (data.status === "ok") {
      props.closecard();
      props.update();
    } else {
      console.log(data);
    }
  };

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open
    >
      <Card
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          zIndex: 10000,
          transform: "translate(-50%, -50%)",
          minWidth: 275,
          maxWidth: 400,
        }}
      >
        <CardHeader title="Raise an Issue" />
        <CardContent>
          <Box component="form" id="newIssueFrom" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField name="title" id="title" label="Title" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  id="description"
                  label="Description"
                  fullWidth
                  multiline
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-around" }}>
          <IconButton aria-label="close" onClick={props.closecard}>
            <CancelIcon />
          </IconButton>
          <Button type="submit" form="newIssueFrom">
            <PlaylistAddCheckIcon />
          </Button>
        </CardActions>
      </Card>
    </Backdrop>
  );
}
