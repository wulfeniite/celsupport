import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PasswordStrengthBar from "react-password-strength-bar";
import { useSearchParams } from "react-router-dom";

import { Images } from "../../assets";
import { resetPassword } from "../../API";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href={process.env.REACT_APP_SITE_OWNER_URL}>
        {process.env.REACT_APP_SITE_OWNER}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("uid");
  const token = searchParams.get("token");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formInput = new FormData(event.currentTarget);

    const password = formInput.get("password");
    const rePassword = formInput.get("re-password");

    if (password !== rePassword) {
      alert("Passwords do not match!");
      return;
    }

    const data = await resetPassword(token, userId, password);

    if (data.status === "ok") {
      window.location.href = "/login";
    } else {
      alert(`Error resetting password! ${data.error}`);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Reset Your Password
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Enter new Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                required
                fullWidth
                name="re-password"
                label="Confirm new Password"
                type="password"
                id="re-password"
                autoComplete="new-password"
              />{" "}
              <PasswordStrengthBar password={password} minLength={8} />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Proceed to Login
              </Button>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${Images.CEL2})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Grid>
    </ThemeProvider>
  );
}
