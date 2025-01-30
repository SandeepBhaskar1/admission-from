import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Form from './Form';
import SubmittedData from './Submitted';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/submitted/:fullName/:emailID" element={<SubmittedData />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
