import { useState } from 'react'
import './App.css'
import Login from "./pages/login/Login.jsx";
import SignUp from "./pages/signup/SignUp.jsx";
import Home from "./pages/home/Home.jsx";

function App() {
    return (
        <div className='flex justify-center items-center h-screen p-4'>
            <Home />
        </div>
    )
}

export default App
