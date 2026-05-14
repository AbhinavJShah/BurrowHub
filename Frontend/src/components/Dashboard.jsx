import { useState } from "react"
import axios from "axios"

const API = "http://localhost:5000"

function Dashboard({ userId }) {
  const [ownerId, setOwnerId] = useState(userId || "")
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API}/received-requests/${ownerId}`)
      setRequests(res.data)
      setSearched(true)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const updateStatus = async (requestId, status) => {
    try {
      await axios.put(`${API}/update-request/${requestId}`, { status })
      setRequests(requests.map(req =>
        req.id === requestId ? { ...req, status } : req
      ))
    } catch (err) {
      alert("Something went wrong ❌")
    }
  }

  return (
    <div style={{ maxWidth: "700px" }}>
      <h2 style={{ marginBottom: "1rem" }}>Owner Dashboard</h2>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <input
          placeholder="Enter your User ID"
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
          style={inputStyle}
        />
        <button onClick={fetchRequests} style={buttonStyle}>
          View Requests
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {searched && requests.length === 0 && (
        <p style={{ color: "#666" }}>No requests received yet.</p>
      )}

      {requests.map(req => (
        <div key={req.id} style={cardStyle}>
          <h3>{req.title}</h3>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>{req.category}</p>
          <p style={{ margin: "0.4rem 0" }}>
            Borrower: <strong>{req.borrower_name}</strong>
          </p>
          <p style={{ margin: "0.4rem 0" }}>
            Status: <span style={{
              fontWeight: "bold",
              color: req.status === "approved" ? "green" :
                     req.status === "rejected" ? "red" :
                     req.status === "returned" ? "blue" : "orange"
            }}>
              {req.status}
            </span>
          </p>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.8rem" }}>
            {req.status === "pending" && (
              <>
                <button
                  onClick={() => updateStatus(req.id, "approved")}
                  style={{ ...actionButton, background: "#10b981" }}
                >
                  Approve ✅
                </button>
                <button
                  onClick={() => updateStatus(req.id, "rejected")}
                  style={{ ...actionButton, background: "#ef4444" }}
                >
                  Reject ❌
                </button>
              </>
            )}
            {req.status === "approved" && (
              <button
                onClick={() => updateStatus(req.id, "returned")}
                style={{ ...actionButton, background: "#6366f1" }}
              >
                Mark Returned 🔄
              </button>
            )}
            {(req.status === "rejected" || req.status === "returned") && (
              <p style={{ color: "#999", fontSize: "0.9rem" }}>No actions available</p>
            )}
          </div>

          <p style={{ fontSize: "0.8rem", color: "#999", marginTop: "0.5rem" }}>
            Requested on: {new Date(req.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}

const inputStyle = {
  padding: "0.7rem",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "1rem",
  flex: 1
}

const buttonStyle = {
  padding: "0.7rem 1.2rem",
  borderRadius: "6px",
  background: "#4f46e5",
  color: "white",
  border: "none",
  fontSize: "1rem",
  cursor: "pointer"
}

const cardStyle = {
  background: "white",
  borderRadius: "8px",
  padding: "1rem",
  marginBottom: "1rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
}

const actionButton = {
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  color: "white",
  border: "none",
  fontSize: "0.9rem",
  cursor: "pointer"
}

export default Dashboard