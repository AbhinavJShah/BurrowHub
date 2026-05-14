import { useState } from "react"
import Auth from "./components/Auth"
import ItemsList from "./components/ItemsList"
import AddItem from "./components/AddItem"
import MyRequests from "./components/MyRequests"
import Dashboard from "./components/Dashboard"
import Needs from "./components/Needs"


function App() {
  const [page, setPage] = useState("home")
  const [dbUser, setDbUser] = useState(null)

  const handleLogin = (user) => {
    setDbUser(user)
    setPage("home")
  }

  const handleLogout = () => {
    setDbUser(null)
    setPage("home")
  }

  if (!dbUser) return <Auth onLogin={handleLogin} />

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>

      {/* NAVBAR */}
      <nav style={{
        background: "#4f46e5",
        padding: "1rem 2rem",
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
      }}>
        <h2
          onClick={() => setPage("home")}
          style={{ color: "white", marginRight: "auto", cursor: "pointer" }}
        >
          🔄 BorrowHub
        </h2>
        {["items", "add", "needs", "requests", "dashboard"].map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              background: page === p ? "white" : "transparent",
              color: page === p ? "#4f46e5" : "white",
              border: "2px solid white",
              padding: "0.4rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.85rem"
            }}
          >
            {p === "items" ? "Browse" :
              p === "add" ? "List Item" :
                p === "needs" ? "Community Needs" :
                  p === "requests" ? "My Requests" : "Dashboard"}
          </button>
        ))}
        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "0.4rem 1rem",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Logout
        </button>
      </nav>

      {/* USER BAR */}
      <div style={{
        padding: "0.5rem 2rem",
        background: "#eef2ff",
        fontSize: "0.9rem",
        borderBottom: "1px solid #c7d2fe"
      }}>
        👋 Welcome back, <strong>{dbUser.name}</strong>
      </div>

      {/* HOME PAGE */}
      {page === "home" && (
        <div>
          {/* HERO */}
          <div style={{
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            color: "white",
            padding: "4rem 2rem",
            textAlign: "center"
          }}>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
              Borrow What You Need 🤝
            </h1>
            <p style={{ fontSize: "1.1rem", opacity: 0.9, maxWidth: "500px", margin: "0 auto 2rem" }}>
              A community platform to lend and borrow items with people around you. No money. Just trust.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => setPage("items")}
                style={{
                  background: "white",
                  color: "#4f46e5",
                  border: "none",
                  padding: "0.8rem 2rem",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Browse Items →
              </button>
              <button
                onClick={() => setPage("add")}
                style={{
                  background: "transparent",
                  color: "white",
                  border: "2px solid white",
                  padding: "0.8rem 2rem",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                List an Item +
              </button>
            </div>
          </div>

          {/* HOW IT WORKS */}
          <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
            <h2 style={{ marginBottom: "2rem", color: "#1f2937" }}>How It Works</h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
              maxWidth: "900px",
              margin: "0 auto"
            }}>
              {[
                { icon: "📦", title: "List Your Item", desc: "Have something others might need? List it in seconds." },
                { icon: "🔍", title: "Browse Items", desc: "Find items listed by people in your community." },
                { icon: "📩", title: "Send a Request", desc: "Request to borrow any available item." },
                { icon: "✅", title: "Get Approved", desc: "Owner approves your request and you're good to go!" }
              ].map((step, i) => (
                <div key={i} style={{
                  background: "white",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{step.icon}</div>
                  <h3 style={{ marginBottom: "0.5rem", color: "#4f46e5" }}>{step.title}</h3>
                  <p style={{ color: "#666", fontSize: "0.9rem" }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div style={{
            background: "white",
            padding: "2rem",
            textAlign: "center",
            borderTop: "1px solid #e5e7eb"
          }}>
            <h2 style={{ marginBottom: "1.5rem", color: "#1f2937" }}>Quick Actions</h2>
            <div style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              {[
                { label: "Browse Items", page: "items", bg: "#4f46e5", icon: "🔍" },
                { label: "List an Item", page: "add", bg: "#10b981", icon: "📦" },
                { label: "My Requests", page: "requests", bg: "#f59e0b", icon: "📩" },
                { label: "Community Needs", page: "needs", bg: "#f59e0b", icon: "🙏" },
                { label: "Dashboard", page: "dashboard", bg: "#6366f1", icon: "📊" },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => setPage(action.page)}
                  style={{
                    background: action.bg,
                    color: "white",
                    border: "none",
                    padding: "1rem 1.5rem",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    minWidth: "160px"
                  }}
                >
                  {action.icon} {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* OTHER PAGES */}
      <div style={{ padding: "2rem" }}>
        {page === "items" && <ItemsList userId={dbUser.id} />}
        {page === "add" && <AddItem userId={dbUser.id} />}
        {page === "requests" && <MyRequests userId={dbUser.id} />}
        {page === "dashboard" && <Dashboard userId={dbUser.id} />}
        {page === "needs" && <Needs userId={dbUser.id} />}
      </div>
    </div>
  )
}

export default App