import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CancelIcon from "@mui/icons-material/Cancel";
import Backdrop from "@mui/material/Backdrop";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import PlaylistAddCheckCircleIcon from "@mui/icons-material/PlaylistAddCheckCircle";
import { Button, TextField } from "@mui/material";

import { openIssue, getUser, resolveIssue } from "../../../API";

export default function IssueCard(props) {
  const [user, setUser] = useState({});
  const [feedback, setFeedback] = useState("");

  const handleOpen = async () => {
    const data = await openIssue(props.data._id, props.userid);
    if (data.status === "ok") {
      props.closecard();
      props.update();
    } else {
      console.log(data);
    }
  };

  const handleResolve = async () => {
    if (feedback === "") {
      alert("Please enter your response");
      return;
    }
    const data = await resolveIssue(props.data._id, feedback);
    if (data.status === "ok") {
      props.closecard();
      props.update();
    } else {
      console.log(data);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUser(props.data.userId);
      if (data.status === "ok") {
        setUser(data.user);
      } else {
        console.log(data);
      }
    };
    fetchUser();
  });

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
          maxWidth: 500,
        }}
      >
        <CardHeader title={user.name} subheader={user.email} />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Issue No.: {props.data.issueNo}
            <br />
            Title: {props.data.title}
            <br />
            Description: {props.data.description}
            <br />
            Status: {props.data.status}
            <br />
            Created On: {props.data.createdAt}
            {props.data.status === "resolved" && (
              <>
                <br />
                {"Resolved On: " + props.data.resolvedAt}
                <br />
                {"Feedback: " + props.data.feedback}
              </>
            )}
          </Typography>
          <br />
          {props.data.status !== "resolved" && (
            <TextField
              name="feedback"
              id="feedback"
              label="Enter Your Response"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              fullWidth
              multiline
            />
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: "space-around" }}>
          {props.data.status === "pending" && (
            <IconButton aria-label="open" onClick={handleOpen}>
              <MarkEmailReadIcon />
            </IconButton>
          )}
          {props.data.status !== "resolved" && (
            <Button aria-label="resolve" onClick={handleResolve}>
              <PlaylistAddCheckCircleIcon />
            </Button>
          )}
          <IconButton aria-label="close" onClick={props.closecard}>
            <CancelIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Backdrop>
  );
}
