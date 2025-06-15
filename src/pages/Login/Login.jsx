import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Tabs, Tab, Paper, InputAdornment, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRegister,useLogin } from '../../hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const navigate =useNavigate()
  const registerMutation=useRegister()
  const loginMutation=useLogin()
  const [tabValue, setTabValue] = useState(0);
  
  // Separate states for login and register forms
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    name: '',
    username: '',
    password: '',
    email: ''
  });
  
  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  
  // Validation error states
  const [loginErrors, setLoginErrors] = useState({
    email: '',
    password: ''
  });

  const [registerErrors, setRegisterErrors] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email ? (emailRegex.test(email) ? '' : 'Please enter a valid email address') : 'Email is required';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validateUsername = (username) => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    return '';
  };

  const validateName = (name) => {
    return name ? '' : 'Name is required';
  };

  // Check if forms are valid
  const isLoginFormValid = () => {
    return (
      loginData.email && 
      loginData.password && 
      !loginErrors.email && 
      !loginErrors.password
    );
  };

  const isRegisterFormValid = () => {
    return (
      registerData.name &&
      registerData.email &&
      registerData.username &&
      registerData.password &&
      !registerErrors.name &&
      !registerErrors.email &&
      !registerErrors.username &&
      !registerErrors.password
    );
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate the field
    if (name === 'email') {
      setLoginErrors(prev => ({
        ...prev,
        email: validateEmail(value)
      }));
    } else if (name === 'password') {
      setLoginErrors(prev => ({
        ...prev,
        password: validatePassword(value)
      }));
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate the field
    switch (name) {
      case 'name':
        setRegisterErrors(prev => ({
          ...prev,
          name: validateName(value)
        }));
        break;
      case 'email':
        setRegisterErrors(prev => ({
          ...prev,
          email: validateEmail(value)
        }));
        break;
      case 'username':
        setRegisterErrors(prev => ({
          ...prev,
          username: validateUsername(value)
        }));
        break;
      case 'password':
        setRegisterErrors(prev => ({
          ...prev,
          password: validatePassword(value)
        }));
        break;
      default:
        break;
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tabValue === 0) {
      // Validate all login fields before submission
      const emailError = validateEmail(loginData.email);
      const passwordError = validatePassword(loginData.password);
      
      setLoginErrors({
        email: emailError,
        password: passwordError
      });
      
      if (!emailError && !passwordError) {
     //use login mutation 
     loginMutation.mutate({
      email:loginData.email,
      password:loginData.password
     })
      }
    } else {
      // Validate all register fields before submission
      const nameError = validateName(registerData.name);
      const emailError = validateEmail(registerData.email);
      const usernameError = validateUsername(registerData.username);
      const passwordError = validatePassword(registerData.password);
      
      setRegisterErrors({
        name: nameError,
        email: emailError,
        username: usernameError,
        password: passwordError
      });
      
      if (!nameError && !emailError && !usernameError && !passwordError) {
        //use register mutation
        registerMutation.mutate({
          name:registerData.name,
          email:registerData.email,
          username:registerData.username,
          password:registerData.password,
          // profileImageUrl:''
        })
      }
    }
  };
  useEffect(() => {
  if (loginMutation.isSuccess) {
    const userRole = loginMutation.data?.role; // adjust based on your API response shape
    if (userRole === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/');
    }
  }
}, [loginMutation.isSuccess, loginMutation.data, navigate]);


  const toggleLoginPasswordVisibility = () => {
    setShowLoginPassword(!showLoginPassword);
  };

  const toggleRegisterPasswordVisibility = () => {
    setShowRegisterPassword(!showRegisterPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url("/ChatGPT Image May 10, 2025, 07_56_49 PM.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        p: 2
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ width: '100%', maxWidth: 400 }}
      >
        <Paper
          elevation={8}
          sx={{
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 3,
            p: 4,
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            opacity: 0.7
          }}
        >
            {/* Add these error displays */}
  {loginMutation.isError && (
    <Typography color="error" sx={{ mb: 2 }}>
      {loginMutation.error.response?.data?.message || 'Login failed'}
    </Typography>
  )}
  
  {registerMutation.isError && (
    <Typography color="error" sx={{ mb: 2 }}>
      {registerMutation.error.response?.data?.message || 'Registration failed'}
    </Typography>
  )}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="inherit"
            indicatorColor="primary"
            sx={{ mb: 2 }}
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          <form onSubmit={handleSubmit}>
            {tabValue === 0 ? (
              // Login Form
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  variant="outlined"
                  error={!!loginErrors.email}
                  helperText={loginErrors.email}
                  InputLabelProps={{ style: { color: '#ccc' } }}
                  InputProps={{ style: { color: '#fff' } }}
                  FormHelperTextProps={{ style: { color: '#f44336' } }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  name="password"
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={handleLoginChange}
                  variant="outlined"
                  error={!!loginErrors.password}
                  helperText={loginErrors.password}
                  InputLabelProps={{ style: { color: '#ccc' } }}
                  FormHelperTextProps={{ style: { color: '#f44336' } }}
                  InputProps={{
                    style: { color: '#fff' },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleLoginPasswordVisibility}
                          edge="end"
                          sx={{ color: '#ccc' }}
                        >
                          {showLoginPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </>
            ) : (
              // Register Form
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Name"
                  name="name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  variant="outlined"
                  error={!!registerErrors.name}
                  helperText={registerErrors.name}
                  InputLabelProps={{ style: { color: '#ccc' } }}
                  InputProps={{ style: { color: '#fff' } }}
                  FormHelperTextProps={{ style: { color: '#f44336' } }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  variant="outlined"
                  error={!!registerErrors.email}
                  helperText={registerErrors.email}
                  InputLabelProps={{ style: { color: '#ccc' } }}
                  InputProps={{ style: { color: '#fff' } }}
                  FormHelperTextProps={{ style: { color: '#f44336' } }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Username"
                  name="username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  variant="outlined"
                  error={!!registerErrors.username}
                  helperText={registerErrors.username}
                  InputLabelProps={{ style: { color: '#ccc' } }}
                  InputProps={{ style: { color: '#fff' } }}
                  FormHelperTextProps={{ style: { color: '#f44336' } }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  name="password"
                  type={showRegisterPassword ? 'text' : 'password'}
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  variant="outlined"
                  error={!!registerErrors.password}
                  helperText={registerErrors.password}
                  InputLabelProps={{ style: { color: '#ccc' } }}
                  FormHelperTextProps={{ style: { color: '#f44336' } }}
                  InputProps={{
                    style: { color: '#fff' },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleRegisterPasswordVisibility}
                          edge="end"
                          sx={{ color: '#ccc' }}
                        >
                          {showRegisterPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </>
            )}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={tabValue === 0 ?
                 !isLoginFormValid()||loginMutation.isPending : !isRegisterFormValid()||registerMutation.isPending}
              sx={{
                mt: 3,
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' }
              }}
            >
              {tabValue === 0 ? loginMutation.isPending ? 'Logging in...' : 'Login' : registerMutation.isPending ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default AuthPage;