import { useEffect, useState } from "react"
import axios from "axios"

const API = "http://localhost:5000"

function ItemsList({ userId }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [borrowerId, setBorrowerId] = useState(userId || "")
  const [message, setMessage] = useState("")

  useEffect(() => {
    axios.get(`${API}/items`)
      .then(res => {
        setItems(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

const requestItem = async (itemId) => {
    if (!borrowerId) {
      alert("Please enter your User ID first!")
      return
    }
    try {
      const res = await axios.post(`${API}/request-item`, {
        item_id: itemId,
        borrower_id: borrowerId
      })

      if (res.data.error) {
        setMessage(res.data.error + " ❌")
      } else {
        setMessage("Request sent successfully! ✅")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (err) {
      if (err.response?.data?.error) {
        setMessage(err.response.data.error + " ❌")
      } else {
        setMessage("Something went wrong ❌")
      }
      setTimeout(() => setMessage(""), 3000)
    }
  }

  if (loading) return <p>Loading items...</p>
  if (items.length === 0) return <p>No items listed yet.</p>

  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>Available Items</h2>

      {/* User ID input */}
      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem" }}>
        <input
          placeholder="Enter your User ID to borrow"
          value={borrowerId}
          onChange={(e) => setBorrowerId(e.target.value)}
          style={inputStyle}
        />
      </div>

      {message && (
        <p style={{ color: "green", marginBottom: "1rem" }}>{message}</p>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "1rem"
      }}>
        {items.map(item => (
          <div key={item.id} style={cardStyle}>
            <h3>{item.title}</h3>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>{item.category}</p>
            <p style={{ margin: "0.5rem 0" }}>{item.description}</p>
            <span style={{
              background: item.status === "available" ? "#d1fae5" : "#fee2e2",
              color: item.status === "available" ? "#065f46" : "#991b1b",
              padding: "0.2rem 0.6rem",
              borderRadius: "999px",
              fontSize: "0.8rem"
            }}>
              {item.status}
            </span>

            {item.status === "available" && item.owner_id !== userId && (
              <button
                onClick={() => requestItem(item.id)}
                style={buttonStyle}
              >
                Request to Borrow
              </button>
            )}

            {item.owner_id === userId && (
              <p style={{ color: "#999", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                This item is listed by you.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const inputStyle = {
  padding: "0.7rem",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "1rem",
  width: "100%",
  maxWidth: "400px"
}

const cardStyle = {
  background: "white",
  borderRadius: "8px",
  padding: "1rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem"
}

const buttonStyle = {
  marginTop: "0.5rem",
  padding: "0.6rem",
  borderRadius: "6px",
  background: "#4f46e5",
  color: "white",
  border: "none",
  fontSize: "0.9rem",
  cursor: "pointer"
}

export default ItemsList