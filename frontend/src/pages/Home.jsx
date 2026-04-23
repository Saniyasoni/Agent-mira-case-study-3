import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { getProperties } from "../services/api";
import PropertyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar";
import "./Home.css";

function Home({ savedIds, onSave, compareIds, onCompare }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const res = await getProperties({ search: searchQuery });
        setProperties(res.data);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [searchQuery]); // Re-fetch whenever searchQuery changes

  return (
    <div className="home-page">
      <section className="hero">
        <h1>
          Find Your <span className="gradient-text">Dream Home</span>
        </h1>
        <p>
          Chat with Mira, your AI-powered real estate assistant, to discover
          properties that match your lifestyle and budget.
        </p>
        <button className="hero-cta" onClick={() => navigate("/chat")}>
          <IoChatbubbleEllipses /> Start Chatting with Mira
        </button>
      </section>

      <section className="properties-section">
        <div className="section-header">
          <h2>Featured Properties</h2>
          <p>Explore our handpicked selection of premium properties</p>
        </div>

        {/* Phase 4: Real-Time Search Bar */}
        <SearchBar onSearch={setSearchQuery} />

        {loading ? (
          <p className="loading-text">Loading properties...</p>
        ) : properties.length === 0 ? (
          <p className="loading-text">No properties found matching your search.</p>
        ) : (
          <div className="properties-grid">
            {properties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                isSaved={savedIds.includes(prop.id)}
                isComparing={compareIds.includes(prop.id)}
                onSave={onSave}
                onCompare={onCompare}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
