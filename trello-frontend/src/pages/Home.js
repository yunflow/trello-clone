import { Box, Container, Typography, Link, Card, CardContent, CardActionArea } from "@mui/material";
import HomeNavigation from "../components/HomeNavigation";
import storage from "../lib/localStorage";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import WorkspaceInfo from "../components/WorkspaceInfo";



function HomePage() {
    //User Authorization
    const navigate = useNavigate();
    const user = storage.get("user");

    useEffect(() => {
        if (user == null) {
            alert("You are not logged in! Please log in to continue.")
            navigate("/login");
        }
    }, [])

    if (user == null) {
        return (
            <>
                <Typography component="h1" variant="h5" sx={{ textAlign: "center", }}>
                    <Link href={"/"}>Click here to go login page if is not back.</Link>
                </Typography>
            </>
        )
    }

    // Home
    return (
        <>
            {/* This is the navigation bar when the user logs in successfully */}
            <HomeNavigation />
            <Box>
                {/* <Workspaces /> */}
                {/* I removed this line because it would result in two navigation bars
                    By Zhaojie Wang */}
                <Container>
                    {/* Vertical display workspaces */}
                    <div className="home-allworkspace">
                        <div id="home-workspace-userinfo">
                            {user.userName} <br />
                            {user.email}
                        </div>


                        <div id="home-workspace-title">Your Workspaces: </div>
                        {/* function to show owned workspaces */}
                        {user.workspaces.map((workspace, index) => (
                            <div key={index}>
                                <Card sx={{ backgroundColor: "#f2f4f5" }}>
                                    <CardContent>
                                        {/* 
                                            WorkspaceInfo.js can show Member or sth
                                        */}
                                        <WorkspaceInfo workspace={workspace} />

                                        {/* Horizontal display boards */}
                                        <div style={{ display: "flex", }}>
                                            {/* function to show owned boards for each workspace */}
                                            {workspace.boards.map((board, index) => (
                                                <div key={index} style={{ paddingRight: "20px" }}>
                                                    <Card>

                                                        {/* Go to Board Page */}
                                                        <CardActionArea href={`/board-home/${workspace.workspaceId}/${board.boardId}`}>
                                                            <div className="Board-Container">
                                                                {board.boardName}
                                                            </div>
                                                        </CardActionArea>
                                                    </Card>
                                                </div>
                                            ))}

                                            {/* last one is used to create a new board */}
                                            <Card>
                                                <CardActionArea href={`/create-board/${workspace.workspaceId}`}>
                                                    <div id="Board-new">
                                                        <AddCircleIcon />
                                                    </div>
                                                </CardActionArea>
                                            </Card>

                                        </div>
                                    </CardContent>
                                </Card>
                                <br />
                            </div>
                        ))}
                    </div>
                </Container>
            </Box>
        </>
    );
}

export default HomePage;