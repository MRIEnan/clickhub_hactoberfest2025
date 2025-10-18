import React from "react";

export default function SearchBarFix() {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <input
        type="text"
        placeholder="Search here..."
        style={{
          width: "300px",
          padding: "10px 15px",
          fontSize: "16px",
          color: "#e0f7fa",
          backgroundColor: "#111827",
          border: "2px solid #00e5ff",
          borderRadius: "10px",
          outline: "none",
        }}
      />
    </div>
  );
}
