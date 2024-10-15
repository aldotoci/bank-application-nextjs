'use client';
import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, List, ListItem, ListItemText, TextField, Button } from '@mui/material';
import Navbar from '@/app/components/Navbar/Navbar';
import AuthService from '@/app/services/authService';
import AdminService from '@/app/services/adminService';
import BankerService from '@/app/services/bankerService';

const UsersPage = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchUsers = async () => {
        try {
          let users;
          if (user.role.admin_permission) {
            users = await AdminService.listUsers();
          } else if (user.role.banker_permission) {
            users = await BankerService.listUsers();
          }
          setUsers(users);
        } catch (error) {
          console.error('Failed to fetch users:', error);
        }
      };

      fetchUsers();
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newUser = {
        username,
        password,
      };
      await AdminService.createUser(newUser);
      alert('User created successfully');
      setUsername('');
      setPassword('');
      if (user) {
        const users = await AdminService.listUsers();
        setUsers(users);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('Error 400: Bad Request. Please check the input fields.');
      } else {
        console.error('Failed to create user:', error);
        alert('User creation failed');
      }
    }
  };

  const handleDelete = async (userId) => {
    try {
      await AdminService.deleteUser(userId);
      alert('User deleted successfully');
      if (user) {
        const users = await AdminService.listUsers();
        setUsers(users);
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('User deletion failed');
    }
  };

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <div>
      <Navbar user={user} />
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Users
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              marginTop: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              width: '100%',
            }}
          >
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
              autoComplete="off"
              variant="outlined"
              required
              sx={{ backgroundColor: 'white' }}
            />
            <TextField
              label="Password"
              type="password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              sx={{ backgroundColor: 'white' }}
            />
            <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
              Create User
            </Button>
          </Box>
          <List>
            {users.map((user) => (
              <ListItem
                key={user.id}
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  padding: '16px',
                  backgroundColor: '#333',
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="h6" color="white">
                      Username: {user.username}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="white">
                        Role: {user.role.role}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        Date: {new Date(user.date).toLocaleDateString()}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        Active: {user.is_active ? 'Yes' : 'No'}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        Staff: {user.is_staff ? 'Yes' : 'No'}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        Last Login: {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                      </Typography>
                      <br />
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDelete(user.id)}
                        sx={{ marginTop: 2 }}
                      >
                        Delete
                      </Button>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </div>
  );
};

export default UsersPage;