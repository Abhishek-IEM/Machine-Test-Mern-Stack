import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ import toast
import "react-toastify/dist/ReactToastify.css"; // ✅ import CSS
import styles from "../styles/Form.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


 //Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/user/login", { email, password });
      localStorage.setItem("token", data.token);

      toast.success("Login successful!");

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      {/* Register link */}
      <p style={{ marginTop: "15px", textAlign: "center", color: "#fff" }}>
        Not a user?{" "}
        <Link
          to="/signup"
          style={{
            color: "#ffeb3b",
            fontWeight: "600",
            textDecoration: "underline",
          }}
        >
          Click here to Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
