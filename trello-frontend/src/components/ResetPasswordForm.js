import { Avatar, Box, Container, InputAdornment, IconButton, Stack, TextField, Typography, Grid, Link } from "@mui/material";
import Navigation from "./Navigation";
import { FormikProvider, useFormik } from "formik";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import * as Yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { LoadingButton } from "@mui/lab";

function ResetPasswordPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const ResetPasswordSchema = Yup.object().shape({
        email: Yup.string()
            .email("Email must be a valid email address")
            .required("Email is required"),
        securityAnswer: Yup.string()
            .min(4, "Too Short!")
            .max(36, "Too Long!")
            .required("Please enter the answer to the security question"),
        password: Yup.string()
            .min(8, "Password must be greater than 8 digits!")
            .required("Password is required"),
        passwordConfirmation: Yup.string().oneOf(
            [Yup.ref("password"), null],
            "Passwords must match"),
    });


    const formik = useFormik({
        initialValues: {
            email: '',
            securityAnswer: '',
            password: '',
            passwordConfirmation: '',
        },
        validationSchema: ResetPasswordSchema,

        onSubmit: async (values) => {
            const { email, securityAnswer, password } = values;
            console.log(email, securityAnswer, password);

            // reset-password: fetch, check if the user email securityAnswer match
            fetch('http://localhost:8311/customer/reset-password', {
                method: 'PUT',
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
                    alert("Password changed successfully! \nBack to the login page...");
                    navigate("/login");
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
            <Navigation />

            <Container maxWidth="sm">
                <Box sx={{ marginTop: 7, alignItems: 'center', }}>
                    <Typography component="h1" variant="h5" sx={{ textAlign: "center", }}>
                        Reset Password
                    </Typography>

                    <FormikProvider value={formik}>
                        <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                    <LockOutlinedIcon />
                                </Avatar>

                                <TextField
                                    fullWidth
                                    type="email"
                                    label="Email"
                                    {...getFieldProps("email")}
                                    error={Boolean(touched.email && errors.email)}
                                    helperText={touched.email && errors.email}
                                />
                                <Typography variant="h6" sx={{ flexGrow: 1 }}>What is the city where you have lived the longest?</Typography>
                                <TextField
                                    fullWidth
                                    label="Security Answer"
                                    {...getFieldProps("securityAnswer")}
                                    error={Boolean(touched.securityAnswer && errors.securityAnswer)}
                                    helperText={touched.securityAnswer && errors.securityAnswer}
                                />
                                <Typography variant="h6" sx={{ flexGrow: 1 }}>New Password:</Typography>
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
                                <LoadingButton
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    loading={isSubmitting}
                                >
                                    Sumbit
                                </LoadingButton>
                                <Grid container>
                                    <Grid item>
                                        <Link href="/signup" variant="body2">
                                            Need a new account? Sign up
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

export default ResetPasswordPage;