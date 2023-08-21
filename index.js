const express = require('express');
const http = require('http');
const path = require('path');

console.log('Starting server...')

const app = express();
const server = http.createServer(app);

const data = require('./capes.json');

// Array to store logged-in users
const usersLoggedIn = [];

app.use(express.json()); // Enable JSON body parsing

// Login route
app.get('/login/:username', (req, res) => {
    const { username } = req.params;

    if (username) {
        // Check if the user is already logged in
        if (usersLoggedIn.includes(username)) {
            return res.status(400).json({ pos: 'User is already logged in' });
        }

        // Log in the user
        usersLoggedIn.push(username);
        return res.json({ pos: 'Login successful' });
    } else {
        return res.status(400).json({ pos: 'Username is required' });
    }
});

// Logout route
app.get('/logout/:username', (req, res) => {
    const { username } = req.params;

    if (username) {
        // Remove user from the logged-in list
        const index = usersLoggedIn.indexOf(username);
        if (index !== -1) {
            usersLoggedIn.splice(index, 1);
            return res.json({ pos: 'Logout successful' });
        } else {
            return res.status(400).json({ pos: 'User is not logged in' });
        }
    } else {
        return res.status(400).json({ pos: 'Username is required' });
    }
});

// Check if a user is logged in
app.get('/users/check/:username', (req, res) => {
    const { username } = req.params;

    if (usersLoggedIn.includes(username)) {
        return res.json({ loggedIn: true });
    } else {
        return res.json({ loggedIn: false });
    }
});

app.get('/', (req, res) => {
    res.send('Proxy initialized');
});

app.get('/cape/:user', (req, res) => {
    const user = path.basename(req.params.user, '.png');
    const png = data[user];
    
    if (png) {
        console.log(`Cape request ${png} for user ${user}`);
        const capeUrl = `http://localhost:3000/capes/${png}`; // Update with your actual domain
        
        res.status(200).json({ pos: capeUrl, status: 200 });
    } else {
        res.status(401).json({ pos: "Dead End", status: 401 });
    }
});

app.get('/capes/:name', (req, res) => {
    const capeName = req.params.name;
    const capePath = path.join(__dirname, 'capes', capeName + '.png');

    res.sendFile(capePath);
});

const port = 8080;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});