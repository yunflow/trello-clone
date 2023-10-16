import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography, Link } from "@mui/material";
import CreateWorkspaceForm from "../components/CreateWorkspaceForm";
import HomeNavigation from "../components/HomeNavigation";
import storage from "../lib/localStorage";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from 'react';

function CreateWorkspacePage() {
    //User Authorization
    const navigate = useNavigate();
    const user = storage.get("user");

    useEffect(() => {
        if(user==null){
            alert("You are not logged in! Please log in to continue.")
            navigate("/login");
        }
    },[])

    if(user==null){
        return(
            <>
                <Typography component="h1" variant="h5" sx={{ textAlign:"center",}}>
                    <Link href={"/"}>Click here to go login page if is not back.</Link>
                </Typography>
            </>
        )
    }

    return (
        <>
            <HomeNavigation />
            <CreateWorkspaceForm /> 
        </>
    );

}

export default CreateWorkspacePage;