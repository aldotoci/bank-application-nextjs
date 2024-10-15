import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { get_nav_options } from "@/app/utils";
import AuthService from '@/app/services/authService';

const Navbar = ({ user }) => {
  const router = useRouter();
  const navOptions = get_nav_options(user?.role?.role || 'client');

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      router.push('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#87CEEB' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'white', fontWeight: 'bold' }}>
          MyApp
        </Typography>
        {navOptions.map((option, index) => (
          <Link key={index} href={option.href} passHref>
            <Button color="inherit" sx={{ color: 'white', fontWeight: 'bold' }}>
              {option.label}
            </Button>
          </Link>
        ))}
        <Button color="inherit" sx={{ color: 'white', fontWeight: 'bold' }} onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;