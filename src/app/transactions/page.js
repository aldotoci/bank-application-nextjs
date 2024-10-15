'use client';
import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, List, ListItem, ListItemText, TextField, MenuItem, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar/Navbar';
import AuthService from '@/app/services/authService';
import ClientService from '@/app/services/clientService';

const Transactions = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [userBankAccounts, setUserBankAccounts] = useState([]);
  const [selectedUserBankAccount, setSelectedUserBankAccount] = useState('');
  const [selectedOtherBankAccount, setSelectedOtherBankAccount] = useState('');
  const [amount, setAmount] = useState('');
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
    const fetchTransactions = async () => {
      if (user) {
        try {
          const userTransactions = await ClientService.listTransactions({ user: user.id });
          setTransactions(userTransactions);
        } catch (error) {
          console.error('Failed to fetch transactions:', error);
        }
      }
    };

    fetchTransactions();
  }, [user]);

  useEffect(() => {
    const fetchBankAccounts = async () => {
      if (user) {
        try {
          const accounts = await ClientService.listBankAccounts();
          setUserBankAccounts(accounts);
        } catch (error) {
          console.error('Failed to fetch bank accounts:', error);
        }
      }
    };

    fetchBankAccounts();
  }, [user]);

  const handleTransfer = async (event) => {
    event.preventDefault();
    try {
      const fromAccount = userBankAccounts.find((account) => account.id === selectedUserBankAccount);
      await ClientService.transferMoney({
        amount: parseFloat(amount),
        currency: fromAccount.currency.id,
        bank_account: selectedUserBankAccount,
        bank_account_receiver: selectedOtherBankAccount,
      });
      alert('Transfer successful');
      setSelectedUserBankAccount('');
      setSelectedOtherBankAccount('');
      setAmount('');
    } catch (error) {
      console.error('Failed to transfer money:', error);
      alert('Transfer failed');
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
            Transactions
          </Typography>
          <List>
            {transactions.map((transaction) => (
              <ListItem
                key={transaction.id}
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
                      Transaction ID: {transaction.transaction_id}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="white">
                        Amount: {transaction.amount}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        Date: {new Date(transaction.date).toLocaleDateString()}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        Bank Account ID: {transaction.bank_account}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        Currency: {transaction.currency}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        Type: {transaction.type}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
          <Box
            component="form"
            onSubmit={handleTransfer}
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
              select
              label="From Account"
              value={selectedUserBankAccount}
              onChange={(e) => setSelectedUserBankAccount(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              sx={{ backgroundColor: 'white' }}
            >
              {userBankAccounts
                .filter((account) => account.user === user.id)
                .filter((account) => !selectedOtherBankAccount || account.id !== selectedOtherBankAccount)
                .map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {`ID: ${account.IBAN}, Currency: ${account.currency}, Balance: ${account.balance}`}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              select
              label="To Account"
              value={selectedOtherBankAccount}
              onChange={(e) => setSelectedOtherBankAccount(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              sx={{ backgroundColor: 'white' }}
            >
              {userBankAccounts
                .filter((account) => !selectedUserBankAccount || account.id !== selectedUserBankAccount)
                .map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {`ID: ${account.IBAN}, Currency: ${account.currency}`}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              inputProps={{
                max: selectedUserBankAccount
                  ? userBankAccounts.find((account) => account.id === selectedUserBankAccount)?.balance
                  : undefined,
              }}
              sx={{ backgroundColor: 'white' }}
            />
            <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
              Transfer
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Transactions;