'use client';
import React, { useState, useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar/Navbar';
import AuthService from '@/app/services/authService';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        console.log('currentUser:', currentUser);
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
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

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
            Profile
          </Typography>
          <Typography variant="h6">
            Username: {user.username}
          </Typography>
          <Typography variant="h6">
            Role: {user.role.role}
          </Typography>
          <Typography variant="h6">
            Date Created: {new Date(user.date).toLocaleDateString()}
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default Profile;