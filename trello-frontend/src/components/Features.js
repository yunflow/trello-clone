import React, { useState } from 'react';
import { Container, Typography, List, ListItem, Checkbox, TextField, Button } from '@mui/material';

function Features() {
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState('');

  const handleAddFeature = () => {
    if (newFeature.trim() !== '') {
      setFeatures([...features, { name: newFeature, status: 'To-Do' }]);
      setNewFeature('');
    }
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedFeatures = [...features];
    updatedFeatures[index].status = newStatus;
    setFeatures(updatedFeatures);
  };

  return (
    <Container maxWidth="md" className="board">
      <Typography variant="h4" align="center" gutterBottom>
        Group Project Board
      </Typography>
      <div className="add-feature">
        <TextField
          label="Enter feature name"
          variant="outlined"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          className="feature-input"
        />
        <Button variant="contained" onClick={handleAddFeature} className="add-feature-btn">
          Add Feature
        </Button>
      </div>
      <List className="features-list">
        {features.map((feature, index) => (
          <ListItem
            key={index}
            className={`task-card ${feature.status.toLowerCase()}`}
            disableGutters
            dense
          >
            <Checkbox
              checked={feature.status === 'Done'}
              onChange={() =>
                handleStatusChange(index, feature.status === 'Done' ? 'To-Do' : 'Done')
              }
            />
            <Typography className="feature-name">{feature.name}</Typography>
            <div className="status-buttons">
              <Button
                onClick={() => handleStatusChange(index, 'To-Do')}
                disabled={feature.status === 'To-Do'}
              >
                To-Do
              </Button>
              <Button
                onClick={() => handleStatusChange(index, 'Doing')}
                disabled={feature.status === 'Doing'}
              >
                Doing
              </Button>
              <Button
                onClick={() => handleStatusChange(index, 'Done')}
                disabled={feature.status === 'Done'}
              >
                Done
              </Button>
            </div>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Features;
