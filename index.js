import express from 'express';
import { MongoClient } from 'mongodb';  // Import MongoDB dependencies
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB connection URL and client setup
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'loginsystem'; // The name of your MongoDB database

// Connect to MongoDB
let db;
client.connect().then(() => {
    db = client.db(dbName);
    console.log("MongoDB connected successfully!");
}).catch(error => console.error("Error connecting to MongoDB:", error));

// Register a new user
app.post("/register", async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    try {
        const result = await db.collection('users').insertOne({ username, password });
        res.send('User registered successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering user');
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Username and password are required");
    }

    try {
        const user = await db.collection('users').findOne({ username, password });
        if (user) {
            res.send(user);
        } else {
            res.status(400).send({ message: "Wrong username/password combination" });
        }
    } catch (err) {
        res.status(500).send({ err });
    }
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});
