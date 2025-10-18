import React from "react";

export default function SearchBarGlassEffect() {
  return (
    <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(135deg, #141e30, #243b55)",
  }}
>
      <input
        type="text"
        placeholder="Search..."
        style={{
          width: "320px",
          padding: "12px 18px",
          fontSize: "16px",
          color: "#fff",
          borderRadius: "12px",
          border: "none",
          outline: "none",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      />
    </div>
  );
}
