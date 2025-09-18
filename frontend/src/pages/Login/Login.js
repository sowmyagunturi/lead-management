/*import React,{useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; // 👈 Import CSS

const Login = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email:"",
    password:"",
  })

  const handleChange = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value});
  }

   const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      
      //console.log("Hi" + data.user);
      if (res.ok) {
        
        
        navigate("/home"); // redirect to home page
      } else {
        alert(data.message || "Invalid credentials, please signup!");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Try again!");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" placeholder="Enter your email..." onChange={handleChange}/>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" placeholder="Enter your password..." onChange={handleChange} />
        </div>

        <button type="submit" className="btn">Login</button>

        <span className="redirect">
          Don’t have an account? <Link to="/register">Signup</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
*/

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext"; // ✅ import context hook
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser(); // ✅ access setUser from context

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Update form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://lead-management-bend.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      console.log("Login response:", data.user);

      if (res.ok) {
        // ✅ Set the user in context
        // Adjust this based on your backend response structure
        const loggedInUser = data.user || {
          name: data.user.name,
          email: data.user.email,
        };

        setUser(loggedInUser); // Save to context + localStorage
        navigate("/home");      // Redirect to home page
      } else {
        alert(data.message || "Invalid credentials, please signup!");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Try again!");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email..."
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password..."
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn">
          Login
        </button>

        <span className="redirect">
          Don’t have an account? <Link to="/register">Signup</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
