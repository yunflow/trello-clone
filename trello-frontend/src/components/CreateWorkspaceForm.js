import React, { useState } from 'react';
import { TextField, Button, Box, Container, Typography } from '@mui/material';
import storage from '../lib/localStorage';
import { useNavigate } from 'react-router-dom';

function WorkspaceForm() {
  const user = storage.get("user");
  const navigate = useNavigate();

  const [createOk, setCreateOk] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState('');

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleMemberChange = (event) => {
    setNewMember(event.target.value);
  };

  const handleAddMember = (event) => {
    event.preventDefault();
    setMembers([...members, newMember]);
    setNewMember('');
  };

  function handleSubmit(event) {
    event.preventDefault();

    // Perform any necessary actions with the form data
    // For example, you could send it to an API or update state in a parent component
    console.log(title, description);
    fetch('http://localhost:8311/workspace/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "workspaceName": title,
        "workspaceDesc": description
      })
    })
      .then(response => response.text())
      .then(data => {
        setCreateOk(true);
        alert("Success in creating a workspace!")

        // When a new workspace is added to the database, assign this database to the user
        let workspaceId = Number(data);
        let paramData = new URLSearchParams();
        paramData.append('userId', user.customerId);
        paramData.append('workspaceId', workspaceId);

        fetch('http://localhost:8311/customer/assign-workspace', {
          method: 'PUT',
          body: paramData
        })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
            storage.put("user", data)

            navigate("/home");
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(error);
      });

    // Reset the form fields and members
    setTitle('');
    setDescription('');
    setMembers([]);
    setNewMember('');
  }

  if (createOk) {
    return (
      <>
        <h2>Loading...</h2>
      </>
    )
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 7, alignItems: 'center', }}>
        <Typography component="h1" variant="h5" sx={{ textAlign: "center", }}>
          Create Workspace
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            value={title}
            onChange={handleTitleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={description}
            onChange={handleDescriptionChange}
            required
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />

          {/*  For technical reasons, the ability to add members to the create workspace 
          page is hidden and will be available after the workspace is created.
          By Zhaojie Wang*/}

          {/* <TextField
            label="Member"
            value={newMember}
            onChange={handleMemberChange}
            fullWidth
            margin="normal"
          />
          <Button onClick={handleAddMember} variant="contained" color="primary">
            Add Member
          </Button> */}
          <ul>
            {members.map((member, index) => (
              <li key={index}>{member}</li>
            ))}
          </ul>
          <Button type="submit" variant="contained" color="primary">
            Create Workspace
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default WorkspaceForm;
