import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'  
import {toast} from 'react-toastify'


export const userContext = React.createContext();
const API_URL = import.meta.env.VITE_API_URL;

const Usercontext = ({children}) => {
 const navigat = useNavigate()
    const [user, setuser] = useState("")

    async function dashboard() {

        try {
          const response = await axios.get(`${API_URL}/api/dashboard`, {
            withCredentials: true,
          });
         if (response.status === 200) {
            setuser(response.data.user);
            navigat("/dashboard");
          }else if (response.status === 401) {
            navigat("/");
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
            navigat("/");
        }
        
    }
    async function logout() {
      console.log("cchhlaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      try {
        const res = await axios.get(`${API_URL}/api/logout`,{withCredentials:true})
        if(res.status  === 200){
          toast.success(res.data.message)
          navigat("/")
        }
      } catch (error) {
        toast.error(error.response.data.message)
      }
      
    }

useEffect(() => {
    dashboard()
}, [])
  return (
    <userContext.Provider value={{ user,logout }}>
        {children}
    </userContext.Provider>
  )
}

export default Usercontext