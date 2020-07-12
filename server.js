const express = require('express');
const app = express();
const path = require('path');
const session = require("express-session");
const request = require("request");

const TOKEN_URL = 'https://github.com/login/oauth/access_token';
const API_URL = 'https://api.github.com/user';
// const REDIRECT_URI_LOCAL = 'http://localhost:8080/callback';
const REDIRECT_URI = 'https://github-users-garwan.herokuapp.com/callback';

// This should be kept in environment variable
const CLIENT_ID = "2ca676099c309d54b713";
const CLIENT_SECRET = "56f08c85c1dcbb5f21ba566340e303e320d4fb53";

// Serve only the static files form the dist directory
app.use(express.static('./dist/git-hub-users'));
app.use(
  session({
    secret: "users-garwan",
    resave: false,
    saveUninitialized: false
  })
);

// Get user data from GitHub API, but for us only login name is important here
const getData = (res, req, access_token) => {
  request(
    {
      uri: API_URL,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'User-Agent': 'users-garwan'
      }
    },
    function(err, response, body) {
      const userData = JSON.parse(body);
      req.session.login = userData.login;
      req.session.access_token = access_token;
      res.redirect("/home");
    }
  );
};

// Callback route from GitHub API
app.get('/callback', (req, res) => {
  const { code } = req.query;
  request(
    {
      uri: TOKEN_URL,
      method: 'POST',
      form: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI
      }
    },
    function(err, response, body) {
      const access_token = body.split("&")[0].split("=")[1];
      getData(res, req, access_token);
    }
  );
});

// This is route to be called by frontend to know the logged in user data
app.get('/session', (req, res) => {
  res.json(req.session);
});

app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname, '/dist/git-hub-users/index.html'));
});

// Start the app by listening on the default Heroku port
let port = process.env.PORT;
if (port == null || port == ""){
  port = 8080;
}
app.listen(port, function(){
  console.log('Server started on port ' + port);
});

