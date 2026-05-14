import { useState } from "react"
import API from "../api"


function Auth({ onLogin }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email) {
      setMessage("Please enter your email ❌")
      return
    }
    setLoading(true)
    setMessage("")

    try {
      // Get all users and find by email
      const res = await fetch(`${API}/users`)
      const users = await res.json()
      const found = users.find(u => u.email === email)

      if (found) {
        // User exists — log them in
        onLogin(found)
      } else {
        // User doesn't exist — create them
        if (!name) {
          setMessage("New user? Please enter your name too ❌")
          setLoading(false)
          return
        }
        const newRes = await fetch(`${API}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email })
        })
        const newUser = await newRes.json()
        onLogin(newUser)
      }
    } catch (err) {
      setMessage("Can't connect to server. Is backend running? ❌")
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f5f5"
    }}>
      <div style={{
        background: "white",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h2 style={{ marginBottom: "0.5rem", color: "#4f46e5" }}>BorrowHub</h2>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          Enter your email to continue
        </p>

        {message && (
          <p style={{
            padding: "0.7rem",
            borderRadius: "6px",
            background: message.includes("❌") ? "#fee2e2" : "#d1fae5",
            color: message.includes("❌") ? "#991b1b" : "#065f46",
            marginBottom: "1rem",
            fontSize: "0.9rem"
          }}>
            {message}
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <input
            placeholder="Your name (only for new users)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? "Please wait..." : "Continue →"}
          </button>
        </div>

        <p style={{ marginTop: "1rem", color: "#999", fontSize: "0.8rem", textAlign: "center" }}>
          New user? Fill in your name too. Existing user? Just enter email.
        </p>
      </div>
    </div>
  )
}

const inputStyle = {
  padding: "0.7rem",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "1rem"
}

const buttonStyle = {
  padding: "0.7rem",
  borderRadius: "6px",
  background: "#4f46e5",
  color: "white",
  border: "none",
  fontSize: "1rem",
  cursor: "pointer"
}

export default Auth