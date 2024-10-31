import React, { useState } from 'react';
import { useNotify, Notification } from 'react-admin';
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Container,
  CssBaseline,
  Grid,
  Paper
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [documentId, setDocumentId] = useState('');
  const notify = useNotify();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Realiza una solicitud POST al endpoint de registro
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          documentId,
        }),
      });

      if (!response.ok) {
        throw new Error('Error registering user');
      }

      const data = await response.json();
      notify('Registration successful, you can now log in', { type: 'success' });
    } catch (error) {
      notify(`Error: ${error.message}`, { type: 'warning' });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 2 }}>
        <Box
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Document ID"
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Paper>
      <Notification />
    </Container>
  );
};

export default RegisterPage;
