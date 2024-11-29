import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS file for styling

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message before making request

    try {
      // Fetch users from Strapi
      const response = await axios.get("https://chat-app-backend-n87k.onrender.com/api/accounts");
      const users = response.data.data;

      // Check if the provided username and email match an existing user
      const user = users.find(
        (u) =>
          u.username === formData.username && u.email === formData.email
      );

      if (user) {
        alert("Login successful!");
        //navigate("/chat"); // Redirect to chat page
        navigate("/chat", { state: { username: formData.username } });
      } else {
        setErrorMessage("Invalid username or email!");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Login</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <input
          className="login-input"
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          required
        />
        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />
        <button className="login-button" type="submit">
          Login
        </button>
        <p className="signup-link">
          Don't have an account?{" "}
          <span onClick={() => navigate("/")} className="signup-link-text">
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
