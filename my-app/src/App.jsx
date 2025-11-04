import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [homestays, setHomestays] = useState([]);
  const [attractions, setAttractions] = useState([]);

  useEffect(() => {
    setHomestays([
      { id: 1, name: "Green Valley Homestay", location: "Coorg", price: 1500 },
      { id: 2, name: "Himalayan Retreat", location: "Manali", price: 2000 },
    ]);
    setAttractions([
      { id: 1, name: "Abbey Falls", location: "Coorg" },
      { id: 2, name: "Solang Valley", location: "Manali" },
    ]);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <AppContext.Provider
      value={{ darkMode, setDarkMode, homestays, attractions }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);

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
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="toggle-btn"
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
    </nav>
  );
};

// PAGES
const Home = () => (
  <div className="page">
    <h1>Welcome to Homestay Explorer</h1>
    <p>Discover homestays, local guides, and attractions near you.</p>
  </div>
);

const Homestays = () => {
  const { homestays } = useApp();
  return (
    <div className="page">
      <h2>Available Homestays</h2>
      <div className="grid">
        {homestays.map((home) => (
          <div key={home.id} className="card">
            <h3>{home.name}</h3>
            <p>{home.location}</p>
            <p>₹{home.price}/night</p>
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

const Host = () => (
  <div className="page">
    <h2>Host Dashboard</h2>
    <p>List and manage your homestays here.</p>
  </div>
);

const Guide = () => (
  <div className="page">
    <h2>Local Guide</h2>
    <p>Share your insights about nearby places and culture.</p>
  </div>
);

const Admin = () => (
  <div className="page">
    <h2>Admin Panel</h2>
    <p>Manage platform content, listings, and users.</p>
  </div>
);

// APP ROOT
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
