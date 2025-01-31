const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'https://admission-from-frontend.vercel.app',
  'https://admission-form-frontend.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

let Form;
try {
  Form = mongoose.model('Form');
} catch {
  Form = mongoose.model('Form', formSchema);
}

async function connectDB() {
    try {
      if (mongoose.connections[0].readyState) {
        return;
      }
  
      const connectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };
  
      await mongoose.connect(process.env.MONGO_URI, connectionOptions);
      console.log('Successfully connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', {
        name: error.name,
        message: error.message
      });
      throw error;
    }
  }

app.get('/', (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.post("/submit", async (req, res) => {
  try {
    await connectDB();
    const newForm = new Form(req.body);
    await newForm.save();
    
    res.status(200).json({ 
      success: true,
      message: "Form Submitted Successfully!"
    });
  } catch (error) {
    console.error('Form submission error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ 
      success: false,
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
      return res.status(404).json({ 
        success: false,
        message: 'Form not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: form
    });
  } catch (error) {
    console.error('Error fetching form data:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching form data', 
      error: error.message 
    });
  }
});

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;