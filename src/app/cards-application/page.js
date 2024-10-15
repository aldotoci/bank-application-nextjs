'use client';
import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, List, ListItem, ListItemText, TextField, MenuItem, Button } from '@mui/material';
import Navbar from '@/app/components/Navbar/Navbar';
import AuthService from '@/app/services/authService';
import ClientService from '@/app/services/clientService';
import BankerService from '@/app/services/bankerService';

const CardsApplication = () => {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [cardTypes, setCardTypes] = useState([]);
  const [selectedBankAccount, setSelectedBankAccount] = useState('');
  const [selectedCardType, setSelectedCardType] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState('');

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
          const applications = await ClientService.listCardApplications();
          setApplications(applications);
        } catch (error) {
          console.error('Failed to fetch applications:', error);
        }
      };

      fetchApplications();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchBankAccounts = async () => {
        try {
          const accounts = await ClientService.listBankAccounts({ filter: { user: user.id } });
          setBankAccounts(accounts);
        } catch (error) {
          console.error('Failed to fetch bank accounts:', error);
        }
      };

      fetchBankAccounts();
    }
  }, [user]);

  useEffect(() => {
    const fetchCardTypes = async () => {
      try {
        const types = await ClientService.getCardTypes();
        setCardTypes(types);
      } catch (error) {
        console.error('Failed to fetch card types:', error);
      }
    };

    fetchCardTypes();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await ClientService.createCardApplication({
        bank_account: selectedBankAccount,
        type: selectedCardType,
        monthly_salary: parseFloat(monthlySalary),
      });
      alert('Application submitted successfully');
      setSelectedBankAccount('');
      setSelectedCardType('');
      setMonthlySalary('');
      if (user) {
        const applications = await ClientService.listCardApplications();
        setApplications(applications);
      }
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert('Application submission failed');
    }
  };

  const handleAction = async (applicationId, action) => {
    try {
      const payload = action === 'rejected' ? { action, reason: rejectReason } : { action };
      await BankerService.cardApplicationBankerAction(applicationId, payload);
      alert(`Application ${action} successfully`);
      if (user) {
        const applications = await ClientService.listCardApplications();
        setApplications(applications);
      }
    } catch (error) {
      console.error(`Failed to ${action} application:`, error);
      alert(`Application ${action} failed`);
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
            Card Applications
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
                label="Bank Account"
                value={selectedBankAccount}
                onChange={(e) => setSelectedBankAccount(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                sx={{ backgroundColor: 'white' }}
              >
                {bankAccounts.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {`ID: ${account.IBAN}, Currency: ${account.currency.currency}, Balance: ${account.balance}`}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Card Type"
                value={selectedCardType}
                onChange={(e) => setSelectedCardType(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                sx={{ backgroundColor: 'white' }}
              >
                {cardTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.type}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Monthly Salary"
                type="number"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                sx={{ backgroundColor: 'white' }}
              />
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
                        Monthly Salary: {application.monthly_salary}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        Date: {new Date(application.date).toLocaleDateString()}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="white">
                        Bank Account ID: {application.bank_account}
                      </Typography>
                      {application.reason && (
                        <>
                          <br />
                          <Typography component="span" variant="body2" color="white">
                            Rejection Reason: {application.reason}
                          </Typography>
                        </>
                      )}
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
                          <TextField
                            label="Rejection Reason"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            required={application.status.status === 'rejected'}
                            sx={{ backgroundColor: 'white', marginTop: 2 }}
                          />
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

export default CardsApplication;