import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import storage from '../lib/localStorage';

function CreateBoardPage({ onBoardCreated }) {
  let { workspaceId } = useParams();
  const navigate = useNavigate();

  const [boardName, setBoardName] = useState('');
  const [createOk, setCreateOk] = useState(false);

  // What happens when click Create Board
  const handleCreateBoard = () => {
    console.log(boardName);

    fetch('http://localhost:8311/board/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "boardName": boardName
      })
    })
      .then(response => response.text())
      .then(data => {
        setCreateOk(true);
        alert("Success in creating a board!")

        // When a new workspace is added to the database, assign this database to the user
        let boardId = Number(data);
        let paramData = new URLSearchParams();
        paramData.append('workspaceId', workspaceId);
        paramData.append('boardId', boardId);

        fetch('http://localhost:8311/workspace/assign-board', {
          method: 'PUT',
          body: paramData
        })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);

            fetch('http://localhost:8311/customer/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(storage.get("user")),
            })
              .then(response => response.json())
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
          });
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(error);
      });
  };

  if (createOk) {
    return (
      <>
        <h2>Loading...</h2>
      </>
    )
  }

  return (
    <Container maxWidth="sm" className="create-board-page">
      <Box sx={{ marginTop: 7, alignItems: 'center', }}>
        <Typography component="h1" variant="h5" sx={{ textAlign: "center", }}>
          Create Board
        </Typography>
        <TextField
          label="Board Name"
          variant="outlined"
          required
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          fullWidth
          className="board-name-input"
          margin="normal"
        />
        <Button variant="contained" onClick={handleCreateBoard} className="create-board-btn">
          Create Board
        </Button>
      </Box>
    </Container>
  );
}

export default CreateBoardPage;
