const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URI = process.env.NODE_ENV === 'development' 
  ? process.env.FRONTEND_LOCAL_URI 
  : process.env.FRONTEND_CLOUD_URI;

// Middleware
app.use(cors({
  origin: FRONTEND_URI,
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Schema
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
}, { timestamps: true });

// Model
let Form;
try {
  Form = mongoose.model('Form');
} catch {
  Form = mongoose.model('Form', formSchema);
}

// Database connection
async function connectDB() {
  try {
    if (mongoose.connections[0].readyState) {
      console.log('Using existing connection');
      return;
    }
    
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, opts);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (error.name === 'MongoTimeoutError') {
      throw new Error('Database connection timed out - please try again');
    }
    throw error;
  }
}

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.post("/submit", async (req, res) => {
  console.log('Starting form submission');
  try {
    console.log('Attempting DB connection');
    await connectDB();
    console.log('DB connected successfully');
    
    console.log('Creating new form');
    const newForm = new Form(req.body);
    console.log('Saving form');
    await newForm.save();
    console.log('Form saved successfully');
    
    res.status(200).json({ message: "Form Submitted Successfully!" });
  } catch (error) {
    console.error('Detailed error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      message: "Error in Submitting the Form", 
      error: error.message 
    });
  }
});

app.get('/submitted/:fullName/:emailID', async (req, res) => {
  try {
    await connectDB();
    
    const { fullName, emailID } = req.params;
    const form = await Form.findOne({ fullName, emailID });
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    res.status(200).json(form);
  } catch (error) {
    console.error('Error fetching form data:', error);
    res.status(500).json({ 
      message: 'Error fetching form data', 
      error: error.message 
    });
  }
});

// Start server only in development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;