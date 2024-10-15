'use client';
import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, List, ListItem, ListItemText, TextField, MenuItem, Button } from '@mui/material';
import Navbar from '@/app/components/Navbar/Navbar';
import AuthService from '@/app/services/authService';
import ClientService from '@/app/services/clientService';
import BankerService from '@/app/services/bankerService';

const BankAccountApplications = () => {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
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
      const fetchApplications = async () => {
        try {
          const applications = await ClientService.listBankAccountApplications();
          console.log('applications', applications);
          setApplications(applications);
        } catch (error) {
          console.error('Failed to fetch applications:', error);
        }
      };

      fetchApplications();
    }
  }, [user]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const currencies = await ClientService.getCurrencies();
        setCurrencies(currencies);
      } catch (error) {
        console.error('Failed to fetch currencies:', error);
      }
    };

    fetchCurrencies();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await ClientService.createBankAccountApplication({
        currency: selectedCurrency,
      });
      alert('Application submitted successfully');
      setSelectedCurrency('');
      if (user) {
        const applications = await ClientService.listBankAccountApplications();
        setApplications(applications);
      }
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert('Application submission failed');
    }
  };

  const handleAction = async (applicationId, action) => {
    try {
      await BankerService.bankApplicationBankerAction(applicationId, { action });
      alert(`Application ${action} successfully`);
      if (user) {
        const applications = await ClientService.listBankAccountApplications();
        setApplications(applications);
      }
    } catch (error) {
      console.error(`Failed to ${action} application:`, error);
      alert(`Application ${action} failed`);
    }
  };

  if (loading || !applications.length || !currencies.length) {
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
            Bank Account Applications
          </Typography>
          {user.role.role === 'client' && (
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
                select
                label="Currency"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                sx={{ backgroundColor: 'white' }}
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency.id} value={currency.id}>
                    {currency.sign} | {currency.currency}
                  </MenuItem>
                ))}
              </TextField>
              <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
                Submit Application
              </Button>
            </Box>
          )}
          <List>
            {applications.map((application) => (
              <ListItem
                key={application.id}
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
                      Application ID: {application.id}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="white">
                        Status: {application.status.status}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        Date: {new Date(application.date).toLocaleDateString()}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        Currency: {application.currency}
                      </Typography>
                      {user.role.role === 'banker' && application.status.status === 'pending' && (
                        <>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleAction(application.id, 'approved')}
                            sx={{ marginTop: 2, marginRight: 1 }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleAction(application.id, 'rejected')}
                            sx={{ marginTop: 2 }}
                          >
                            Reject
                          </Button>
                        </>
                      )}
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

export default BankAccountApplications;