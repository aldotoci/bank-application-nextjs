'use client';
import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar/Navbar';
import AuthService from '@/app/services/authService';
import ClientService from '@/app/services/clientService';

const BankAccounts = () => {
  const [user, setUser] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);
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
    const fetchBankAccounts = async () => {
      if (user) {
        try {
            if (user.role.role === 'client') {
                console.log('user:', user);
                const accounts = await ClientService.listBankAccounts({filter: { user: user.id }});
                console.log('accounts:', accounts);
                setBankAccounts(accounts);
            }else if(user.role.role === 'banker') {
                const accounts = await BankerService.listBankAccounts();
                setBankAccounts(accounts);
            }
          setBankAccounts(accounts);
        } catch (error) {
          console.error('Failed to fetch bank accounts:', error);
        }
      }
    };

    fetchBankAccounts();
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
            Bank Accounts
          </Typography>
          <List>
            {bankAccounts.map((account) => (
              <ListItem
                key={account.id}
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
                      Account ID: {account.bank_account_id}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="white">
                        IBAN: {account.IBAN}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        Balance: {account.balance}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        Date Created: {new Date(account.date).toLocaleDateString()}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        Currency: {account.currency.currency}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        User ID: {account.user.id}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        Username: {account.user.username}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        Bank Application ID: {account.bankApplication}
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

export default BankAccounts;