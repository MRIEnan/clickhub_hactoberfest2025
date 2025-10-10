"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import "./button.css";

export default function RandomPasswordButton() {
  const [password, setPassword] = useState("");

  // Function inside component
  const createPassword = () => {
    const length = 12;
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let pass = "";
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  const copyPassword = () => {
    if (password !== "") {
      navigator.clipboard.writeText(password);
      alert("Password copied to clipboard!");
    }
  };

  return (
    <div className="password-container">
      <input
        type="text"
        value={password}
        readOnly
        placeholder="Your password"
      />

      <motion.button
        className="generate-btn"
        onClick={createPassword}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 0 25px rgba(127,0,255,0.6)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        ⚡ Generate Password
      </motion.button>

      <motion.button
        className="copy-btn"
        onClick={copyPassword}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        📋 Copy
      </motion.button>
    </div>
  );
}
