import React, { useState } from "react";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Simulate response data
const postData = (req) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const res = {
        status: "success",
        data: {},
        errors: {},
      };
      if (req.email === "test@email.com") {
        res.status = "error";
        res.errors.email = "This email is already registered";
      }
      if (req.password.length < 6) {
        res.status = "error";
        res.errors.password = "Password must be at least 6 characters";
      }
      resolve(res);
    }, 1500);
  });
};

const signUpTheme = createTheme();

const signUpInputDefault = {
  email: "",
  password: "",
};

const signUpValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function SignUp() {
  const [values, setValues] = useState(signUpInputDefault);
  const [serverSideValidate, setServerSideValidate] = useState({
    status: "idle",
    data: {},
    errors: {},
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm({
    resolver: yupResolver(signUpValidationSchema),
  });

  const handleChange = (value) => {
    setValues(value);
  };

  const onSubmit = async (data) => {
    setServerSideValidate((state) => ({ ...state, errors: {} }));
    try {
      console.log("Request: ");
      setServerSideValidate((state) => ({ ...state, status: "loading" }));
      console.log(data);
      const result = await postData(data);
      console.log("Response: ");
      console.log(result);
      if (result.status === "error") {
        setServerSideValidate((state) => ({ ...state, errors: result.errors }));
        reset({ password: "" });
        setServerSideValidate((state) => ({ ...state, status: "idle" }));
      }
      if (result.status === "success") {
        console.log("Sign Up successfully!");
        reset();
        setServerSideValidate((state) => ({ ...state, status: "idle" }));
      }
    } catch (error) {
      console.log("Error: ");
      console.log(error);
    }
  };

  return (
    <ThemeProvider theme={signUpTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h4">
            Sign Up
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              type="email"
              autoFocus
              {...register("email")}
              error={
                errors.email || serverSideValidate.errors.email ? true : false
              }
              helperText={
                errors.email?.message || serverSideValidate.errors.email
              }
              onChange={(event) =>
                handleChange({ ...values, email: event.target.value })
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              type="password"
              {...register("password")}
              error={errors.password ? true : false}
              helperText={errors.password?.message}
              onChange={(event) =>
                handleChange({ ...values, password: event.target.value })
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={serverSideValidate.status === "loading"}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
