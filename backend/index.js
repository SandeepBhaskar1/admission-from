const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URI = process.env.NODE_ENV === 'development' 
  ? process.env.FRONTEND_CLOUD_URI 
  : process.env.FRONTEND_LOCAL_URI;

app.use(cors({
  origin: FRONTEND_URI,
  methods: ["GET", "POST", "OPTIONS"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Schema definition
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

// Mongoose model
let Form;
try {
  Form = mongoose.model('Form');
} catch {
  Form = mongoose.model('Form', formSchema);
}

// Database connection function
async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Submit form route
app.post("/submit", async (req, res) => {
  try {
    await connectDB();
    
    const newForm = new Form(req.body);
    await newForm.save();
    
    res.status(200).json({ message: "Form Submitted Successfully!" });
  } catch (error) {
    console.error('Form submission error:', error);
    res.status(500).json({ 
      message: "Error in Submitting the Form", 
      error: error.message 
    });
  }
});

// Get submitted form route
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

// Only start the server if not running in Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;