const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// load mock data
const dataPath = path.join(__dirname, 'MOCK_DATA.json');
let users = []

try {
    const rawData = fs.readFileSync(dataPath);
    users = JSON.parse(rawData);
} catch (error) {
    console.error("Error reading MOCK_DATA.json:", error);
}

// Middleware to parse JSON (for POST/PUT in the future)
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// root route
app.get('/', (req, res) => {
    res.send("Welcome to the API!");
})

// get all users
app.get('/users', (req, res) => {
    res.json(users);
})

// get user by id
app.get('/users/:id', (req, res) => {
    const userId = Number(req.params.id);
    const user = users.find(u => u.id === userId);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({message: 'User not found'});
    }
});

// add a new user
app.post('/users', (req, res) => {
    const newUser = req.body;

    // basic validation
    if (!newUser.first_name || !newUser.last_name || !newUser.email) {
        return res.status(400).json({message: 'Missing required fields'});
    }

    newUser.id = users.length > 0 ? users[users.length - 1].id + 1: 1;
    users.push(newUser);
    res.status(201).json(newUser);
});


//update a user
app.put('/users/:id', (req, res) => {
    const userId = Number(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({message: 'User not found'});
    }
    users[userIndex] = {...users[userIndex], ...req.body};
    res.json(users[userIndex]);
});

// delete a user
app.delete('/users/:id', (req, res) => {
    const userId = Number(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1){
        return res.status(404).json({message: 'User not found'});
    }

    const deletedUser = users.splice(userIndex, 1);
    res.json({message: 'User deleted', user: deletedUser[0]});
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});