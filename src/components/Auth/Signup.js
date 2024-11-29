import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";  // Import the CSS file for styling

function Signup() {
  const [formData, setFormData] = useState({ username: "", password: "", email: "" });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://chat-app-backend-n87k.onrender.com/api/accounts", { data: formData });
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Signup failed!");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <h2 className="signup-title">Sign Up</h2>
        <input
          className="signup-input"
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
        <input
          className="signup-input"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          className="signup-input"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button className="signup-button" type="submit">Sign Up</button>
        <p className="signup-link">
          Already have an account? <span onClick={() => navigate("/login")} className="login-link">Login</span>
        </p>
      </form>
    </div>
  );
}

export default Signup;

