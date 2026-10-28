import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Lainging from './pages/Lainging'
import Login from './pages/Login'
import Dasbord from './pages/Dasbord'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  return (
  <>
   <Routes> 
      <Route path="/login" element={<Login />} />
        <Route path="/" element={<Lainging />} />
     
        <Route path="/dashboard" element={<Dasbord />} />
      </Routes>
   <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
  </>
     
  )
}

export default App