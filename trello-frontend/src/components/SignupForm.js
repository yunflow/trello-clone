import React from "react";
import { LoadingButton } from "@mui/lab";
import { Link, InputAdornment, Stack, Avatar, Box, IconButton, Container, Grid, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState } from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/user/UserSlice";
import { useNavigate } from "react-router-dom";

function SignUpForm() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const SignUpSchema = Yup.object().shape({
        userName: Yup.string()
            .min(4, "Too Short!")
            .max(36, "Too Long!")
            .required("Username is required"),
        email: Yup.string()
            .email("Email must be a valid email address")
            .required("Email is required"),
        password: Yup.string()
            .min(8, "Password must be greater than 8 digits!")
            .required("Password is required"),
        passwordConfirmation: Yup.string().oneOf(
            [Yup.ref("password"), null],
            "Passwords must match"),
        securityAnswer: Yup.string()
            .min(4, "Too Short!")
            .max(36, "Too Long!")
            .required("Please enter the answer to the security question"),
    });

    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            userName: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            securityAnswer: '',
        },
        validationSchema: SignUpSchema,

        onSubmit: async (values) => {
            const { userName, email, password, securityAnswer } = values;
            console.log(userName, email, password, securityAnswer);

            fetch('http://localhost:8311/customer/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            })
                .then(response => response.text())
                .then(data => {
                    console.log(data);

                    // data is the message from the method "String signUp(User user)" in back-end
                    if (data === "sign up success") {
                        // dispatch(setUser({
                        //     userName, email, password, securityAnswer,
                        // }))
                        alert("Register successfully! \nBack to the login page...");

                        // TODO: When a user has registered successfully, 
                        // should we take the user directly to the home page or back to the login to log in again?
                        // navigate("/home");
                        navigate("/login");

                        // TODO: set flag to whole page
                        // if we just back to /login, Whenever we need to authenticate a user, 
                        // we only need to read the area through the login screen
                    } else {
                        alert(data);
                    }
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
                        Sign-up
                    </Typography>

                    <FormikProvider value={formik}>
                        <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                    <LockOutlinedIcon />
                                </Avatar>
                                <TextField
                                    fullWidth
                                    label="User Name"
                                    {...getFieldProps("userName")}
                                    error={Boolean(touched.userName && errors.userName)}
                                    helperText={touched.userName && errors.userName}
                                />
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
                                <TextField
                                    fullWidth
                                    type={showPassword ? "text" : "password"}
                                    label="Confirm Password"
                                    {...getFieldProps("passwordConfirmation")}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    edge="end"
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                >
                                                    {showPassword ? (
                                                        <VisibilityIcon />
                                                    ) : (
                                                        <VisibilityOffIcon />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    error={Boolean(touched.passwordConfirmation && errors.passwordConfirmation)}
                                    helperText={touched.passwordConfirmation && errors.passwordConfirmation}
                                />
                                <Typography variant="h6" sx={{ flexGrow: 1 }}>What is the city where you have lived the longest?</Typography>
                                <TextField
                                    fullWidth
                                    label="Security Answer"
                                    {...getFieldProps("securityAnswer")}
                                    error={Boolean(touched.securityAnswer && errors.securityAnswer)}
                                    helperText={touched.securityAnswer && errors.securityAnswer}
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
                                    <Grid item>
                                        <Link href="/login" variant="body2">
                                            Already have an account? Log in
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

export default SignUpForm;