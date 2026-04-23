import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Saved from "./pages/Saved";
import Compare from "./pages/Compare";
import { getSavedProperties, saveProperty, removeSavedProperty } from "./services/api";
import "./App.css";

function App() {
  // Saved properties state
  const [savedProperties, setSavedProperties] = useState([]);
  const savedIds = savedProperties.map((p) => p.id);

  // Compare properties state
  const [compareProperties, setCompareProperties] = useState([]);
  const compareIds = compareProperties.map((p) => p.id);

  // Fetch saved properties on load
  useEffect(() => {
    async function fetchSaved() {
      try {
        const res = await getSavedProperties();
        setSavedProperties(res.data);
      } catch (err) {
        console.error("Failed to fetch saved properties:", err);
      }
    }
    fetchSaved();
  }, []);

  // Toggle save
  async function handleSave(property) {
    try {
      const exists = savedProperties.find((p) => p.id === property.id);
      if (exists) {
        await removeSavedProperty(property.id);
        setSavedProperties((prev) => prev.filter((p) => p.id !== property.id));
      } else {
        await saveProperty(property);
        setSavedProperties((prev) => [...prev, property]);
      }
    } catch (err) {
      console.error("Error toggling save:", err);
      alert("Failed to update saved properties. Is the backend running?");
    }
  }

  // Toggle compare
  function handleCompare(property) {
    setCompareProperties((prev) => {
      const exists = prev.find((p) => p.id === property.id);
      if (exists) {
        return prev.filter((p) => p.id !== property.id);
      }
      if (prev.length >= 4) {
        alert("You can compare up to 4 properties at a time.");
        return prev;
      }
      return [...prev, property];
    });
  }

  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                savedIds={savedIds}
                onSave={handleSave}
                compareIds={compareIds}
                onCompare={handleCompare}
              />
            }
          />
          <Route
            path="/chat"
            element={
              <Chat
                savedIds={savedIds}
                onSave={handleSave}
                compareIds={compareIds}
                onCompare={handleCompare}
              />
            }
          />
          <Route
            path="/saved"
            element={
              <Saved
                savedProperties={savedProperties}
                savedIds={savedIds}
                onSave={handleSave}
                compareIds={compareIds}
                onCompare={handleCompare}
              />
            }
          />
          <Route
            path="/compare"
            element={
              <Compare
                compareProperties={compareProperties}
                onCompare={handleCompare}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
