import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/users");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img
          src="/pictures/logo.png"
          alt="Logo"
          className="login-logo"
        />
        <h3 className="login-title">Sign in</h3>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <img
              src={showPassword ? "/pictures/eye-off.png" : "/pictures/eye.png"}
              alt="Toggle Password"
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          <button type="submit" className="login-button">
           <span>Login</span>
          </button>
        </form>
      </div>
    </div>
  );
}
