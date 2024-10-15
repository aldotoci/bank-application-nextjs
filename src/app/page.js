'use client';
import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from './services/authService';

function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const authService = new AuthService();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          router.push('/profile');
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <main>
        {/* Content can go here */}
      </main>
    </div>
  );
}

export default Home;