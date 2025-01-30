import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';  
import './App.css';

const SubmittedData = () => {
    const [formData, setFormData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { fullName, emailID } = useParams(); 

    const BACKEND_URI = process.env.NODE_ENV === 'development'
        ? "http://localhost:4292" 
        : "https://admission-from-backend.vercel.app"; 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BACKEND_URI}/submitted/${fullName}/${emailID}`); 

                if (!response.ok) {
                    throw new Error('Form data not found'); 
                }

                const data = await response.json();
                setFormData(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
    }, [fullName, emailID]);

    if (error) {
        return <p>{`Error: ${error}`}</p>;
    }

    if (!formData) {
        return <p>Loading...</p>;
    }

    const handleAnotherForm = () => {
        navigate('/'); 
    };

    return (
        <div className="submitted-data">
            <h1>Form Submitted Successfully!</h1>
            <div className="form-summary">
                <p><strong>Full Name:</strong> {formData.fullName}</p>
                <p><strong>Date of Birth:</strong> {formData.dob}</p>
                <p><strong>Gender:</strong> {formData.gender}</p>
                <p><strong>Email ID:</strong> {formData.emailID}</p>
                <p><strong>Phone Number:</strong> {formData.phoneNumber}</p>
                <p><strong>Course:</strong> {formData.course}</p>
                <p><strong>College Studied:</strong> {formData.collageStudied}</p>
                <p><strong>GPA:</strong> {formData.gpa}</p>
                <p><strong>Address:</strong> {formData.address}</p>
                <p><strong>Parent's Name:</strong> {formData.parentName}</p>
                <p><strong>Parent's Email ID:</strong> {formData.parentEmail}</p>
                <p><strong>Parent's Phone Number:</strong> {formData.parentPhoneNo}</p>
            </div>
            <button onClick={handleAnotherForm}>Submit Another Form</button>
        </div>
    );
};

export default SubmittedData;
