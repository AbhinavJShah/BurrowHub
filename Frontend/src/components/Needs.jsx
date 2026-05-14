import { useState, useEffect } from "react"
import axios from "axios"
import API from "../api"


function Needs({ userId }) {
  const [needs, setNeeds] = useState([])
  const [myNeeds, setMyNeeds] = useState([])
  const [view, setView] = useState("browse")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [form, setForm] = useState({
    title: "",
    description: "",
    days_needed: ""
  })

  useEffect(() => {
    fetchNeeds()
    fetchMyNeeds()
  }, [])

  const fetchNeeds = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API}/needs`)
      setNeeds(res.data)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const fetchMyNeeds = async () => {
    try {
      const res = await axios.get(`${API}/my-needs/${userId}`)
      setMyNeeds(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.title) {
      setMessage("Please enter what you need ❌")
      return
    }
    if (!form.days_needed || form.days_needed < 1) {
      setMessage("Please enter how many days you need it ❌")
      return
    }

    try {
      await axios.post(`${API}/needs`, {
        requester_id: userId,
        title: form.title,
        description: form.description,
        days_needed: parseInt(form.days_needed)
      })
      setMessage("Need posted successfully! ✅")
      setForm({ title: "", description: "", days_needed: "" })
      fetchNeeds()
      fetchMyNeeds()
      setTimeout(() => setMessage(""), 3000)
    } catch (err) {
      setMessage("Something went wrong ❌")
    }
  }

  const markFulfilled = async (id) => {
    try {
      await axios.put(`${API}/needs/${id}`, { status: "fulfilled" })
      setMyNeeds(myNeeds.map(n => n.id === id ? { ...n, status: "fulfilled" } : n))
      fetchNeeds()
    } catch (err) {
      alert("Something went wrong ❌")
    }
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      <h2 style={{ marginBottom: "0.5rem" }}>Community Needs 🙏</h2>
      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        Post what you need or help someone by lending your item
      </p>

      {/* TABS */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {["browse", "post", "myneeds"].map(tab => (
          <button
            key={tab}
            onClick={() => setView(tab)}
            style={{
              padding: "0.5rem 1.2rem",
              borderRadius: "6px",
              border: "2px solid #4f46e5",
              background: view === tab ? "#4f46e5" : "white",
              color: view === tab ? "white" : "#4f46e5",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {tab === "browse" ? "Browse Needs" :
             tab === "post" ? "Post a Need" : "My Needs"}
          </button>
        ))}
      </div>

      {/* BROWSE NEEDS */}
      {view === "browse" && (
        <div>
          {loading && <p>Loading...</p>}
          {!loading && needs.length === 0 && (
            <p style={{ color: "#666" }}>No needs posted yet. Be the first!</p>
          )}
          {needs.map(need => (
            <div key={need.id} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ marginBottom: "0.3rem" }}>{need.title}</h3>
                  <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                    {need.description}
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "#4f46e5", fontWeight: "bold" }}>
                    ⏳ Needed for {need.days_needed} day{need.days_needed > 1 ? "s" : ""}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "#999", marginTop: "0.3rem" }}>
                    Posted by <strong>{need.requester_name}</strong> on {new Date(need.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span style={{
                  background: "#d1fae5",
                  color: "#065f46",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap"
                }}>
                  {need.status}
                </span>
              </div>

              {need.requester_id !== userId && (
                <div style={{
                  marginTop: "0.8rem",
                  padding: "0.7rem",
                  background: "#eef2ff",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  color: "#4f46e5"
                }}>
                  💡 Have this item? Go to <strong>List Item</strong> and list it, or check if you already have it listed!
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* POST A NEED */}
      {view === "post" && (
        <div style={{ maxWidth: "500px" }}>
          {message && (
            <p style={{
              padding: "0.7rem",
              borderRadius: "6px",
              background: message.includes("❌") ? "#fee2e2" : "#d1fae5",
              color: message.includes("❌") ? "#991b1b" : "#065f46",
              marginBottom: "1rem"
            }}>
              {message}
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <input
              name="title"
              placeholder="What do you need? (e.g. Laptop, Calculator) *"
              value={form.title}
              onChange={handleChange}
              style={inputStyle}
            />
            <textarea
              name="description"
              placeholder="Why do you need it? (e.g. To fill out a form)"
              value={form.description}
              onChange={handleChange}
              style={{ ...inputStyle, height: "100px", resize: "vertical" }}
            />
            <input
              name="days_needed"
              type="number"
              min="1"
              placeholder="How many days do you need it? *"
              value={form.days_needed}
              onChange={handleChange}
              style={inputStyle}
            />
            <p style={{ color: "#999", fontSize: "0.8rem" }}>* Required fields</p>
            <button onClick={handleSubmit} style={buttonStyle}>
              Post My Need 🙏
            </button>
          </div>
        </div>
      )}

      {/* MY NEEDS */}
      {view === "myneeds" && (
        <div>
          {myNeeds.length === 0 && (
            <p style={{ color: "#666" }}>You haven't posted any needs yet.</p>
          )}
          {myNeeds.map(need => (
            <div key={need.id} style={cardStyle}>
              <h3 style={{ marginBottom: "0.3rem" }}>{need.title}</h3>
              <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                {need.description}
              </p>
              <p style={{ fontSize: "0.85rem", color: "#4f46e5", fontWeight: "bold" }}>
                ⏳ {need.days_needed} day{need.days_needed > 1 ? "s" : ""}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.8rem" }}>
                <span style={{
                  background: need.status === "open" ? "#d1fae5" : "#e0e7ff",
                  color: need.status === "open" ? "#065f46" : "#3730a3",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "999px",
                  fontSize: "0.8rem"
                }}>
                  {need.status}
                </span>
                {need.status === "open" && (
                  <button
                    onClick={() => markFulfilled(need.id)}
                    style={{
                      padding: "0.4rem 1rem",
                      borderRadius: "6px",
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      fontSize: "0.85rem",
                      cursor: "pointer"
                    }}
                  >
                    Mark Fulfilled ✅
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const cardStyle = {
  background: "white",
  borderRadius: "8px",
  padding: "1rem",
  marginBottom: "1rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
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

export default Needs