import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './App.css';

const BACKEND_URI = ["http://localhost:4292" || "https://admission-from-backend.vercel.app"]

const SubmittedData = () => {
    const [formData, setFormData] = useState(null);
    const navigate = useNavigate();
    const {fullName,emailID} =useParams(); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BACKEND_URI}/submitted/${fullName}/${emailID}`);
                const data = await response.json();
                setFormData(data);
            } catch (error) {
                console.error('Error fetching form data:', error);
            }
        };

        fetchData();
    }, [fullName, emailID]);

    if (!formData) {
        return <p>Loading...</p>;
    }

    const handleAnotherForm = () => {
        navigate("/") 
    };

    return (
        <div className="submitted-data">
            <h3>Form Submitted Successfully!</h3>
            <p><strong>Full Name:</strong> {formData.fullName}</p>
            <p><strong>Date of Birth:</strong> {formData.dob}</p>
            <p><strong>Gender:</strong> {formData.gender}</p>
            <p><strong>Email ID:</strong> {formData.emailID}</p>
            <p><strong>Phone Number:</strong> {formData.phoneNumber}</p>
            <p><strong>Course:</strong> {formData.course}</p>
            <p><strong>Collage Studied:</strong> {formData.collageStudied}</p>
            <p><strong>GPA:</strong> {formData.gpa}</p>
            <p><strong>Address:</strong> {formData.address}</p>
            <p><strong>Parent's / Guardian's Name:</strong> {formData.parentName}</p>
            <p><strong>Parent's / Guardian's Email ID:</strong> {formData.parentEmail}</p>
            <p><strong>Parent's / Guardian's Phone Number:</strong> {formData.parentPhoneNo}</p>
            <button onClick={handleAnotherForm}>Submit Another Form</button>
        </div>
    );
};

export default SubmittedData;
