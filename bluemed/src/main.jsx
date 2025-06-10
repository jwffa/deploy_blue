import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Route, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home.jsx'
import BlogPage from '../components/blog/BlogPage.jsx'
import Register from '../components/register-login/Register.jsx'
import Login from '../components/register-login/Login.jsx'
import DoctorDetails from '../components/doctorsSection/DoctorDetails.jsx'
import Consultation from '../components/consultation/Consultation.jsx'
import DoctorsPage from '../components/consultation/DoctorsPage.jsx'
const router = createBrowserRouter([
  {
    path: "/",
    element: <App><Home/></App>
  },
  { 
    path: "/blog-1", 
    element: <App><BlogPage/></App>
  },
  {
    path: "/register",
    element: <App><Register/></App>
  },
  {
    path: "/login",
    element: <App><Login/></App>
  },
  {
    path: "/doctors/:id",
    element: <App><DoctorDetails/></App>
  },
  {
    path: "/videoCall",
    element: <App><Consultation/></App>
  },
  {
    path: "/doctors",
    element: <App><DoctorsPage/></App>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
