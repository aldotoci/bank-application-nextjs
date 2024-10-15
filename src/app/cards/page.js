'use client';
import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar/Navbar';
import AuthService from '@/app/services/authService';
import ClientService from '@/app/services/clientService';

const Cards = () => {
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchCards = async () => {
      if (user) {
        try {
          const userCards = await ClientService.listCards({ user: user.id });
          setCards(userCards);
        } catch (error) {
          console.error('Failed to fetch cards:', error);
        }
      }
    };

    fetchCards();
  }, [user]);

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
            Cards
          </Typography>
          <List>
            {cards.map((card) => (
              <ListItem
                key={card.id}
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
                      Card Number: {card.card_number}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="white">
                        Expiry Date: {new Date(card.expiry_date).toLocaleDateString()}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        CVV: {card.cvv}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        Date Created: {new Date(card.date).toLocaleDateString()}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        User ID: {card.user}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        Bank Account ID: {card.bank_account}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        Card Type: {card.type.type}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        Card Application ID: {card.cardApplication}
                      </Typography>
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

export default Cards;