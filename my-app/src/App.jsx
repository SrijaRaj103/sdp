import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";

// 🌍 Context
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [homestays, setHomestays] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );

  // Fetch data (mock API or local JSON)
  useEffect(() => {
    // Simulating API call using axios (you can replace with real API)
    axios
      .get("https://mocki.io/v1/9b5c95e5-d6c3-4951-bb91-18cfb1476e22")
      .then((res) => {
        setHomestays(res.data.homestays);
        setAttractions(res.data.attractions);
      })
      .catch(() => {
        // Fallback data if API fails
        setHomestays([
          { id: 1, name: "Green Valley Homestay", location: "Coorg", price: 1500 },
          { id: 2, name: "Himalayan Retreat", location: "Manali", price: 2000 },
          { id: 3, name: "Beach View Cottage", location: "Goa", price: 2500 },
        ]);
        setAttractions([
          { id: 1, name: "Abbey Falls", location: "Coorg" },
          { id: 2, name: "Solang Valley", location: "Manali" },
          { id: 3, name: "Baga Beach", location: "Goa" },
        ]);
      });
  }, []);

  // Persist dark mode and favorites
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [darkMode, favorites]);

  return (
    <AppContext.Provider
      value={{
        darkMode,
        setDarkMode,
        homestays,
        attractions,
        favorites,
        setFavorites,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);

// 🌐 Navbar
const Navbar = () => {
  const { darkMode, setDarkMode } = useApp();
  return (
    <nav className="navbar">
      <h2>🏡 Homestay Explorer</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/homestays">Homestays</Link></li>
        <li><Link to="/attractions">Attractions</Link></li>
        <li><Link to="/host">Host</Link></li>
        <li><Link to="/guide">Guide</Link></li>
        <li><Link to="/admin">Admin</Link></li>
      </ul>
      <button onClick={() => setDarkMode(!darkMode)} className="toggle-btn">
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
    </nav>
  );
};

// 🏠 Pages
const Home = () => (
  <div className="page">
    <h1>Welcome to Homestay Explorer</h1>
    <p>
      Discover affordable homestays and hidden gems across India.
      Experience travel like a local, guided by the people who live there.
    </p>
    <div className="info-grid">
      <div className="info-card">
        <h3>💬 Local Insights</h3>
        <p>Get recommendations from real locals for authentic experiences.</p>
      </div>
      <div className="info-card">
        <h3>🏠 Homestays</h3>
        <p>Stay with friendly hosts who open their homes to travelers.</p>
      </div>
      <div className="info-card">
        <h3>🗺️ Attractions</h3>
        <p>Explore nearby natural and cultural attractions effortlessly.</p>
      </div>
    </div>
  </div>
);

const Homestays = () => {
  const { homestays, favorites, setFavorites } = useApp();
  const [search, setSearch] = useState("");

  const filtered = homestays.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="page">
      <h2>Available Homestays</h2>
      <input
        type="text"
        placeholder="Search homestays..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search"
      />
      <div className="grid">
        {filtered.map((home) => (
          <div key={home.id} className="card">
            <h3>{home.name}</h3>
            <p>{home.location}</p>
            <p>₹{home.price}/night</p>
            <button onClick={() => toggleFavorite(home.id)}>
              {favorites.includes(home.id) ? "❤️ Liked" : "🤍 Like"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Attractions = () => {
  const { attractions } = useApp();
  return (
    <div className="page">
      <h2>Nearby Attractions</h2>
      <div className="grid">
        {attractions.map((place) => (
          <div key={place.id} className="card">
            <h3>{place.name}</h3>
            <p>{place.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Host = () => {
  const [form, setForm] = useState({ name: "", location: "", price: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", location: "", price: "" });
  };

  return (
    <div className="page">
      <h2>Host Dashboard</h2>
      <p>List and manage your homestays here.</p>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Homestay Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price per night"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <button type="submit">Add Homestay</button>
      </form>
      {submitted && <p style={{ color: "green" }}>Homestay added successfully!</p>}
    </div>
  );
};

const Guide = () => (
  <div className="page">
    <h2>Local Guide</h2>
    <p>Share your insights about nearby places, food, and culture.</p>
    <ul style={{ textAlign: "left", margin: "auto", width: "60%" }}>
      <li>🏞️ Best trekking routes in Coorg.</li>
      <li>🍛 Must-try local dishes in Manali.</li>
      <li>🎨 Art and craft markets in Goa.</li>
    </ul>
  </div>
);

const Admin = () => (
  <div className="page">
    <h2>Admin Panel</h2>
    <p>Manage users, listings, and reviews.</p>
    <div className="grid">
      <div className="card">
        <h3>👥 Users</h3>
        <p>Manage user accounts and permissions.</p>
      </div>
      <div className="card">
        <h3>🏠 Listings</h3>
        <p>Review and approve new homestay listings.</p>
      </div>
      <div className="card">
        <h3>⭐ Reviews</h3>
        <p>Monitor feedback from travelers and hosts.</p>
      </div>
    </div>
  </div>
);

// 🌗 Root
const App = () => {
  const { darkMode } = useApp();
  return (
    <div className={darkMode ? "dark" : "light"}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/homestays" element={<Homestays />} />
        <Route path="/attractions" element={<Attractions />} />
        <Route path="/host" element={<Host />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
};

// MAIN EXPORT
export default function WrappedApp() {
  return (
    <AppProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProvider>
  );
}
