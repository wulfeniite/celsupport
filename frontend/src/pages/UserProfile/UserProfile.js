import { useCallback, useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import PasswordStrengthBar from "react-password-strength-bar";
import jwt_decode from "jwt-decode";

import { changePassword } from "../../API";

const UserProfile = () => {
  const [values, setValues] = useState({
    oldPassword: "",
    password: "",
    rePassword: "",
  });

  const [user, setUser] = useState({});

  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (values.password !== values.rePassword) {
      alert("Passwords do not match");
      return;
    }

    if (values.password === values.oldPassword) {
      alert("New password cannot be same as old password");
      return;
    }

    const data = await changePassword(
      user.id,
      values.oldPassword,
      values.password
    );
    if (data.status === "ok") {
      setValues({
        oldPassword: "",
        password: "",
        rePassword: "",
      });
      alert(data.message);
    } else {
      console.log(data);
      alert(data.error[0].msg || data.error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwt_decode(token);
    setUser(decoded);
  }, []);

  return (
    <>
      <Card>
        <CardHeader
          title={user.name}
          subheader={user.department + " - " + user.email + ` (${user.mobile})`}
        />
      </Card>
      <br />
      <form
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
        id="password-reset"
      >
        <Card>
          <CardHeader title="Change Password?" />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Enter Old Password"
                    name="oldPassword"
                    type="password"
                    onChange={handleChange}
                    required
                    value={values.oldPassword}
                  />
                </Grid>
                <Grid xs={12} md={6}></Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Enter New Password"
                    helperText="Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character"
                    name="password"
                    onChange={handleChange}
                    type="password"
                    required
                    value={values.password}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="rePassword"
                    onChange={handleChange}
                    type="password"
                    required
                    value={values.rePassword}
                  />
                  <PasswordStrengthBar
                    password={values.password}
                    minLength={8}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button variant="contained" type="submit">
              Update Password
            </Button>
          </CardActions>
        </Card>
      </form>
    </>
  );
};

export default UserProfile;
