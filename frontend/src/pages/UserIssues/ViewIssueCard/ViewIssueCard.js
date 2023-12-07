import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import Backdrop from "@mui/material/Backdrop";

export default function IssueCard(props) {
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
        <CardHeader
          title={`${props.data.issueNo}. ${props.data.title}`}
          subheader={props.data.createdAt}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {props.data.description}
            <br /> {"Status: " + props.data.status}
            {props.data.status === "resolved" && (
              <>
                <br />
                {"Resolved On: " + props.data.resolvedAt}
                <br />
                {"Feedback: " + props.data.feedback}
              </>
            )}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-around" }}>
          {props.data.status === "pending" && (
            <IconButton aria-label="delete" onClick={props.delete}>
              <DeleteIcon />
            </IconButton>
          )}
          <IconButton aria-label="close" onClick={props.closecard}>
            <CancelIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Backdrop>
  );
}
