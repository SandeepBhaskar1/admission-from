const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const FRONTEND_URI = process.env.FRONTEND_CLOUD_URI || process.env.FRONTEND_LOCAL_URI;

app.use(cors({
    origin: "https://admission-form-frontend.vercel.app",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const formSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    emailID: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    course: { type: String, required: true },
    collageStudied: { type: String, required: true },
    gpa: { type: String, required: true },
    address: { type: String, required: true },
    parentName: { type: String, required: true },
    parentEmail: { type: String, required: true },
    parentPhoneNo: { type: String, required: true },
});

const Form = mongoose.model('Form', formSchema);

app.get('/', (req, res) => {
    res.status(200).json({ message: "Server is running" });
});

app.post("/submit", (req, res) => {
    const {
        fullName,
        dob,
        gender,
        emailID,
        phoneNumber,
        course,
        collageStudied,
        gpa,
        address,
        parentName,
        parentEmail,
        parentPhoneNo
    } = req.body;

    const newForm = new Form({
        fullName,
        dob,
        gender,
        emailID,
        phoneNumber,
        course,
        collageStudied,
        gpa,
        address,
        parentName,
        parentEmail,
        parentPhoneNo
    });

    newForm.save()
        .then(() => {
            res.status(200).json({ message: "Form Submitted Successfully!" });
        })
        .catch((error) => {
            res.status(500).json({ message: "Error in Submitting the Form", error });
        });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB connection error:", err));

module.exports = app;
