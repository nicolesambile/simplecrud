
require('dotenv').config();

const express = require('express');
const cors = require('cors');
require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// CONNECT TRUCK ROUTES
app.use('/api/trucks', require('./routes/trucks'));

app.get('/', (req, res) => {
    res.send('Truck Delivery Management System API is running!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
