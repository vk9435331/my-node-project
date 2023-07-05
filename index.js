const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const app = express();
const PORT = 3000;
const apiKey = 'AIzaSyCOwquZU3T2MviGC-e45XkqaQPynzEi8Lo'
const CLIENT_ID = '555436206626-nb8qleipomu714anqu3tfm7arqpia24o.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const url = `https://gmail.googleapis.com/gmail/v1/users/me/labels?key=${apiKey}`;
const REDIRECT_URI =`http://localhost:3000`;
const SCOPES = ['https://mail.google.com/']; // Specify the required scopes for accessing user data

// Redirect users to Google's authentication endpoint
app.get('/', (req, res) => {
  const authUrl = 'https://accounts.google.com/o/oauth2/auth?' + querystring.stringify({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(' '),
  });
  res.redirect(authUrl);
});

// Handle the callback from Google after authentication
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  // Exchange authorization code for access token
  const tokenParams = {
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
  };

  try {
    const tokenResponse = await axios.post('https://accounts.google.com/o/oauth2/token', querystring.stringify(tokenParams), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const accessToken = tokenResponse.data.access_token;
    const refreshToken = tokenResponse.data.refresh_token;

    // Use the access token to fetch user information or make API requests
    // For example, you can use the token to fetch the user's profile information
    const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const userProfile = profileResponse.data;
    console.log(userProfile);

    // You can store the access token and refresh token in your database for future use

    res.send('Authentication successful!');
  } catch (error) {
    console.error('Error authenticating with Google:', error);
    res.status(500).send('An error occurred during authentication');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
