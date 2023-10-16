import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

function WorkspaceInfo({ workspace }) {
    const [members, setMembers] = useState(null);
    const [newMember, setNewMember] = useState();
    useEffect(() => {
        let paramData = new URLSearchParams();
        paramData.append('workspaceId', workspace.workspaceId);
        fetch("http://localhost:8311/customer/get-workspace-member", {
            method: 'PUT',
            body: paramData
        })
            .then(response => response.json())
            .then(data => { setMembers(data) })
            .catch(error => console.error('Error:', error));
    }, []);

    const handleMemberChange = (event) => {
        setNewMember(event.target.value);
    };

    // add member
    const addMemberEvent = () => {
        let paramData = new URLSearchParams();
        paramData.append('userName', newMember);
        paramData.append('workspaceId', workspace.workspaceId);
        fetch("http://localhost:8311/customer/add-member", {
            method: 'PUT',
            body: paramData
        })
            .then(response => {
                if (!response.ok) {
                    alert("Cannot find user: " + newMember + ", or this user is already a member");
                    throw new Error("Cannot find user: " + newMember);
                }
                return response.json();
            })
            .then(data => {
                setMembers(data);
                alert(newMember + " has been added to this workspace.");
            })
            .catch(error => console.error('Error:', error));
    }

    if (!members) {
        return (
            <>
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
            <div id="workspace-info">
                <div id="workspace-info-title">
                    {workspace.workspaceName}
                </div>
                <div id="workspace-info-desc">
                    &emsp;&emsp;&emsp;&emsp;{workspace.workspaceDesc}
                </div>
                <br />
                <Typography variant="body2" color="text.secondary">
                    {"Member: "}
                    {members.map((user, index) => (
                        <span key={index}>
                            <b>{user.userName}</b> &emsp;
                        </span>
                    ))}

                    <input type="text" size="15" onChange={handleMemberChange} />

                    <Button onClick={addMemberEvent}>
                        Add member
                    </Button>
                </Typography>

            </div >
        </>
    );
}

export default WorkspaceInfo;