import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate, Link } from "react-router-dom"; 
import MobileInput from "./MobileInput";
import styles from "../styles/Form.module.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  //Handle SignUp
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      await API.post("/user/register", { name, email, mobile, password });
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Admin Signup</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className={styles.inputWrapper}>
          <MobileInput value={mobile} onChange={setMobile} />
        </div>
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
      </form>

      {/* Login link */}
      <p style={{ marginTop: "15px", textAlign: "center", color: "#fff" }}>
        Already have an account?{" "}
        <Link
          to="/login"
          style={{
            color: "#ffeb3b",
            fontWeight: "600",
            textDecoration: "underline",
          }}
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;
