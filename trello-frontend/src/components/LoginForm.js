import React from "react";
import { LoadingButton } from "@mui/lab";
import { Link, Stack, Avatar, Box, Container, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import storage from "../lib/localStorage";


function LoginForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .email("Email must be a valid email address")
            .required("Please input your email"),
        password: Yup.string()
            .min(8, "Password must be greater than 8 digits")
            .required("Please input your password"),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginSchema,

        onSubmit: async (values) => {
            const { email, password } = values;
            console.log(email, password);

            // login: fetch, check if the user email password match
            fetch('http://localhost:8311/customer/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Invalid email or password");
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    // [data] is the found user information

                    alert("Login Sucessful!\n");

                    // set flag to whole page
                    storage.put("user",data);//Store data in storage.put to overwrite localStorage

                    // navigate("/home"); then some workspace stuff
                    navigate("/home");
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert(error);
                });
        }
    });

    const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

    return (
        <>
            <Container maxWidth="sm">
                <Box sx={{ marginTop: 7, alignItems: 'center', }}>
                    <Typography component="h1" variant="h5" sx={{ textAlign: "center", }}>
                        Log-in
                    </Typography>

                    <FormikProvider value={formik}>
                        <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>

                                </Avatar>
                                <TextField
                                    fullWidth
                                    type="email"
                                    label="Email"
                                    {...getFieldProps("email")}
                                    error={Boolean(touched.email && errors.email)}
                                    helperText={touched.email && errors.email}
                                />
                                <TextField
                                    fullWidth
                                    type="password"
                                    label="Password"
                                    {...getFieldProps("password")}
                                    error={Boolean(touched.password && errors.password)}
                                    helperText={touched.password && errors.password}
                                />
                                <LoadingButton
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    loading={isSubmitting}
                                >
                                    Sumbit
                                </LoadingButton>

                                <Grid container justifyContent="flex-end">
                                    <Grid item sx={{ flexGrow: 1, display: "flex" }}>
                                        <Link href="/reset-password" variant="body2">
                                            Forgot your password?
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="/signup" variant="body2">
                                            Dont't have an account? Sign up
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </form>
                    </FormikProvider>
                </Box>
            </Container>
        </>
    );
}

export default LoginForm;