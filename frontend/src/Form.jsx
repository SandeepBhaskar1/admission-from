import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import './App.css';

const Form = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        gender: 'select',
        emailID: '',
        phoneNumber: '',
        course: 'select',
        collageStudied: '',
        gpa: '',
        address: '',
        parentName: '',
        parentEmail: '',
        parentPhoneNo: '',
    });

    const navigate = useNavigate();  

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const BACKEND_URI = ["http://localhost:4292" || "https://admission-form-backend.vercel.app"]

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.fullName || !formData.dob || formData.gender === 'select' || !formData.emailID 
            || !formData.phoneNumber || formData.course === 'select' || !formData.collageStudied || !formData.gpa 
            || !formData.address || !formData.parentName || !formData.parentEmail || !formData.parentPhoneNo) {
            alert('All Fields Required!');
            return; 
        }
    
        const urlEncodedData = new URLSearchParams(formData).toString();
    
        try {
            const response = await fetch(`${BACKEND_URI}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlEncodedData,
            });
    
            if (response.ok) {
                const result = await response.json();
                alert('Form Submitted Successfully!');
                navigate(`/submitted/${formData.fullName}/${formData.emailID}`);
            } else {
                throw new Error('Something went wrong while submitting the form.');
            }
        } catch (error) {
            console.log('Error:', error);
            alert('Failed to submit the form. Please try again.' + error.message);
        }
    
        setFormData({
            fullName: '',
            dob: '',
            gender: 'select',
            emailID: '',
            phoneNumber: '',
            course: 'select',
            collageStudied: '',
            gpa: '',
            address: '',
            parentName: '',
            parentEmail: '',
            parentPhoneNo: '',
        });
    };

    return (
        <div className='form-container'>
            <h1 className='title'>Admission form</h1>
            <div className="input-container">
                <form action="input" onSubmit={handleSubmit}>
                    <label htmlFor="fullName">Full Name :</label>
                    <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        autoComplete="name" 
                    />

                    <label htmlFor="dob">Date of Birth :</label>
                    <input
                        type="date"
                        name="dob"
                        id="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        autoComplete="bday" 
                    />

                    <label htmlFor="gender">Gender :</label>
                    <select
                        name="gender"
                        id="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        autoComplete="off"  
                    >
                        <option value="select" disabled>Select Your Gender :</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="others">Others</option>
                    </select>

                    <label htmlFor="emailID">Email ID :</label>
                    <input 
                        type="email" 
                        name="emailID" 
                        id="emailID" 
                        value={formData.emailID} 
                        onChange={handleChange} 
                        autoComplete="email"  
                    />

                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input 
                        type="tel" 
                        name="phoneNumber" 
                        id="phoneNumber" 
                        value={formData.phoneNumber} 
                        onChange={handleChange} 
                        autoComplete="tel"  
                    />

                    <label htmlFor="course">Course :</label>
                    <select
                        name="course"
                        id="course"
                        value={formData.course}
                        onChange={handleChange}
                        autoComplete="off"  
                    >
                        <option value="select" disabled>Select the Course</option>
                        <option value="civil">Civil Engineering</option>
                        <option value="mechanical">Mechanical Engineering</option>
                        <option value="e&c">Electrical and Communication Engineering</option>
                        <option value="cs">Computer Science Engineering</option>
                        <option value="aeronautical">Aeronautical Engineering</option>
                        <option value="biotechnical">Biotechnical Engineering</option>
                    </select>

                    <label htmlFor="collageStudied">College Studied :</label>
                    <input 
                        type="text" 
                        name="collageStudied" 
                        id="collageStudied" 
                        value={formData.collageStudied} 
                        onChange={handleChange} 
                        autoComplete="organization"  
                    />

                    <label htmlFor="gpa">GPA :</label>
                    <input 
                        type="text" 
                        name="gpa" 
                        id="gpa" 
                        value={formData.gpa} 
                        onChange={handleChange} 
                        autoComplete="off"  
                    />

                    <label htmlFor="address">Address :</label>
                    <input 
                        type="text" 
                        name="address" 
                        id="address" 
                        value={formData.address} 
                        onChange={handleChange} 
                        autoComplete="address"  
                    />

                    <label htmlFor="parentName">Parent or Guardian Name :</label>
                    <input 
                        type="text" 
                        name="parentName" 
                        id="parentName" 
                        value={formData.parentName} 
                        onChange={handleChange} 
                        autoComplete="name" 
                    />

                    <label htmlFor="parentEmail">Parent's Email ID :</label>
                    <input 
                        type="email" 
                        name="parentEmail" 
                        id="parentEmail" 
                        value={formData.parentEmail} 
                        onChange={handleChange} 
                        autoComplete="email"  
                    />

                    <label htmlFor="parentPhoneNo">Parent's Contact Number :</label>
                    <input 
                        type="tel" 
                        name="parentPhoneNo" 
                        id="parentPhoneNo" 
                        value={formData.parentPhoneNo} 
                        onChange={handleChange} 
                        autoComplete="tel"  
                    />

                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Form;
