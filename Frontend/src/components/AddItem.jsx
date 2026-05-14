import { useState } from "react"
import axios from "axios"
import API from "../api"

function AddItem({ userId }) {
  const [form, setForm] = useState({
    owner_id: userId || "",
    title: "",
    category: "",
    description: ""
  })
  const [message, setMessage] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.title) {
      setMessage("Please enter item title ❌")
      return
    }
    if (!form.category) {
      setMessage("Please enter item category ❌")
      return
    }
    if (!form.description) {
      setMessage("Please enter item description ❌")
      return
    }

    try {
      await axios.post(`${API}/items`, form)
      setMessage("Item listed successfully! ✅")
      setForm({ owner_id: userId || "", title: "", category: "", description: "" })
    } catch (err) {
      setMessage("Something went wrong ❌")
    }
  }

  return (
    <div style={{ maxWidth: "500px" }}>
      <h2 style={{ marginBottom: "1rem" }}>List an Item</h2>

      {message && (
        <p style={{
          marginBottom: "1rem",
          padding: "0.7rem",
          borderRadius: "6px",
          background: message.includes("❌") ? "#fee2e2" : "#d1fae5",
          color: message.includes("❌") ? "#991b1b" : "#065f46"
        }}>
          {message}
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        <input
          name="title"
          placeholder="Item title (e.g. Scientific Calculator) *"
          value={form.title}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="category"
          placeholder="Category (e.g. Electronics, Books) *"
          value={form.category}
          onChange={handleChange}
          style={inputStyle}
        />
        <textarea
          name="description"
          placeholder="Description (e.g. available for 3 days) *"
          value={form.description}
          onChange={handleChange}
          style={{ ...inputStyle, height: "100px", resize: "vertical" }}
        />
        <p style={{ color: "#999", fontSize: "0.8rem" }}>* All fields are required</p>
        <button onClick={handleSubmit} style={buttonStyle}>
          List Item
        </button>
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

export default AddItem