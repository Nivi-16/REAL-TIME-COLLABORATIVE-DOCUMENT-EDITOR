import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { FaUsers } from "react-icons/fa";

const socket = io("http://localhost:5000");

function App() {
  const [text, setText] = useState("");
  const [users, setUsers] = useState(0);

  useEffect(() => {
    socket.on("receive-changes", (data) => {
      setText(data);
    });

    socket.on("user-count", (count) => {
      setUsers(count);
    });

    return () => {
      socket.off("receive-changes");
      socket.off("user-count");
    };
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    socket.emit("send-changes", value);
  };

  const downloadFile = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "document.txt";
    link.click();
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Collab Editor</h2>

        <div style={styles.memberBox}>
          <FaUsers /> <span>{users} Active Users</span>
        </div>

        <button
          style={styles.primaryBtn}
          onMouseOver={(e) => (e.target.style.background = "#00c6ff")}
          onMouseOut={(e) => (e.target.style.background = "#0099ff")}
        >
          Share Room
        </button>

        <button
          style={styles.dangerBtn}
          onClick={() => window.location.reload()}
          onMouseOver={(e) => (e.target.style.background = "#ff4d4d")}
          onMouseOut={(e) => (e.target.style.background = "#cc0000")}
        >
          Leave Session
        </button>
      </div>

      {/* Editor */}
      <div style={styles.editorArea}>
        <button
          style={styles.downloadBtn}
          onClick={downloadFile}
          onMouseOver={(e) => (e.target.style.background = "#ff4d4d")}
          onMouseOut={(e) => (e.target.style.background = "#e60000")}
        >
          Download
        </button>

        <textarea
          value={text}
          onChange={handleChange}
          placeholder="Start collaborating..."
          style={styles.textarea}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Segoe UI, sans-serif",
    background: "linear-gradient(135deg, #141e30, #243b55)",
    color: "white",
  },
  sidebar: {
    width: "260px",
    background: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(10px)",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "4px 0 20px rgba(0,0,0,0.5)",
  },
  logo: {
    marginBottom: "40px",
    letterSpacing: "1px",
  },
  memberBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "30px",
    fontSize: "18px",
  },
  primaryBtn: {
    background: "#0099ff",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    marginBottom: "15px",
    transition: "0.3s",
  },
  dangerBtn: {
    background: "#cc0000",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    transition: "0.3s",
  },
  editorArea: {
    flex: 1,
    padding: "30px",
    position: "relative",
  },
  downloadBtn: {
    position: "absolute",
    right: "30px",
    top: "30px",
    background: "#e60000",
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    transition: "0.3s",
  },
  textarea: {
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    color: "#00ffcc",
    border: "none",
    outline: "none",
    padding: "25px",
    fontSize: "16px",
    borderRadius: "12px",
    resize: "none",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
  },
};

export default App;
