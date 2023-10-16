import { useNavigate, useParams } from "react-router-dom";
import HomeNavigation from "../components/HomeNavigation";
import { AppBar, Box, Button, Card, CardActionArea, Container, Toolbar, Typography } from "@mui/material";
import storage from "../lib/localStorage";
import { useEffect, useState } from "react";
import TaskInfo from "../components/TaskInfo";

function BoardHome() {
    let { workspaceId} = useParams();
    let { boardId } = useParams();
    const navigate = useNavigate();

    const [board, setBoard] = useState(null);
    useEffect(() => {
        let paramData = new URLSearchParams();
        paramData.append('boardId', boardId);
        fetch("http://localhost:8311/board/find-board", {
            method: 'PUT',
            body: paramData
        })
            .then(response => response.json())
            .then(data => { setBoard(data) })
            .catch(error => console.error('Error:', error));
    }, []);

    const handleDeleteBoard = () => {
        let paramData = new URLSearchParams();
        paramData.append('boardId', boardId);
        fetch("http://localhost:8311/board/delete-board", {
            method: 'DELETE',
            body: paramData
        })
            .then(response => response.text())
            .then(data => {
                alert(data);
                fetch('http://localhost:8311/customer/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(storage.get("user")),
                }).then(response => response.json())
                    .then(data => {
                        console.log(data);
                        storage.put("user", data);
                        navigate("/home");
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        alert(error);
                    });
            })
            .catch((error) => {
                console.error('Error:', error);
                alert(error);
            });
    }

    if (!board) {
        return (
            <>
                <HomeNavigation />
                <Box>
                    <Container>
                        Loading...
                    </Container>
                </Box>
            </>
        )
    }

    return (
        <>
            <HomeNavigation />

            <Box>
                <div className="Board-bar">
                    <div className="Board-bar-inside">
                        <span>Board Name: <b>{board.boardName}</b></span>
                    </div>
                    <div className="Board-bar-inside">
                        <span>Board Id: <b>{board.boardId}</b></span>
                    </div>
                    <div className="Board-bar-inside">
                        <CardActionArea>
                            <Button onClick={handleDeleteBoard}>
                                Delete Board
                            </Button>
                        </CardActionArea>
                    </div>
                </div>

                {/* Show all the Task-related stuff in a Board here (release 3) */}
                <div id="TaskContainer">
                    <TaskInfo boardObject={board} workspaceId={workspaceId} />
                </div>
            </Box >
        </>
    );
}

export default BoardHome;