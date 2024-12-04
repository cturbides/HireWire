import React, { useState } from "react";
import { useLogin, useNotify, Notification } from "react-admin";
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Container,
  CssBaseline,
  Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const CustomLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Estado para alternar entre login y registro
  const login = useLogin();
  const notify = useNotify();

  // Manejador para enviar el formulario de inicio de sesión
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login({ email, password }).catch(() => notify("Invalid email or password"));
  };

  // Manejador para enviar el formulario de registro
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        throw new Error("Error registering user");
      }

      const data = await response.json();
      notify("Registration successful, you can now log in", {
        type: "success",
      });
      setIsRegistering(false); // Vuelve al formulario de inicio de sesión
    } catch (error) {
      notify(`Error: ${error.message}`, { type: "warning" });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 2 }}>
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            {isRegistering ? <PersonAddIcon /> : <LockOutlinedIcon />}
          </Avatar>
          <Typography component="h1" variant="h5">
            {isRegistering ? "Register" : "Sign In"}
          </Typography>

          {/* Formulario de Login */}
          {!isRegistering && (
            <Box component="form" onSubmit={handleLoginSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setIsRegistering(true)} // Cambiar a registro
                sx={{ mt: 1 }}
              >
                Register
              </Button>
            </Box>
          )}

          {/* Formulario de Registro */}
          {isRegistering && (
            <Box
              component="form"
              onSubmit={handleRegisterSubmit}
              sx={{ mt: 1 }}
            >
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
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setIsRegistering(false)} // Volver a login
                sx={{ mt: 1 }}
              >
                Back to Sign In
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
      <Notification />
    </Container>
  );
};

export default CustomLoginPage;
