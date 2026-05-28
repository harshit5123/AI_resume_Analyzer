require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

require('./conn');

app.use(express.json());

app.use(cors({
    credentials: true,
    origin: [
        'http://localhost:5173',
        'https://ai-resume-analyser-beta-seven.vercel.app' 
    ]
}));

const userRoute = require('./Routes/user');
const resumeRoute = require('./Routes/resume');

app.use('/api/user', userRoute);
app.use('/api/resume', resumeRoute);

app.listen(PORT, () => {
    console.log("backend server is running on port ", PORT);
})