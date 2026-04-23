import PropertyCard from "../components/PropertyCard";
import "./Saved.css";

function Saved({ savedProperties, savedIds, onSave, compareIds, onCompare }) {
  return (
    <div className="saved-page">
      <div className="container">
        <div className="section-header">
          <h2>
            <span className="gradient-text">Saved Properties</span>
          </h2>
          <p>Your bookmarked properties all in one place</p>
        </div>

        {savedProperties.length === 0 ? (
          <div className="saved-empty">
            <div className="empty-icon">📭</div>
            <p>No saved properties yet. Browse or chat with Mira to find homes!</p>
          </div>
        ) : (
          <div className="properties-grid">
            {savedProperties.map((prop) => (
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
      </div>
    </div>
  );
}

export default Saved;
