import { IoLocationSharp, IoBedOutline, IoWaterOutline, IoResizeOutline, IoBookmark, IoBookmarkOutline, IoGitCompare } from "react-icons/io5";
import "./PropertyCard.css";

function PropertyCard({ property, onSave, onCompare, isSaved, isComparing }) {
  return (
    <div className="property-card">
      <div className="property-card-image-wrapper">
        <img
          className="property-card-image"
          src={property.image_url}
          alt={property.title}
          loading="lazy"
        />
        <div className="property-card-price">
          ${property.price.toLocaleString()}
        </div>
      </div>

      <div className="property-card-body">
        <h3 className="property-card-title">{property.title}</h3>

        <div className="property-card-location">
          <IoLocationSharp /> {property.location}
        </div>

        <div className="property-card-specs">
          <div className="property-card-spec">
            <IoBedOutline /> <span>{property.bedrooms}</span> Beds
          </div>
          <div className="property-card-spec">
            <IoWaterOutline /> <span>{property.bathrooms}</span> Baths
          </div>
          <div className="property-card-spec">
            <IoResizeOutline /> <span>{property.size_sqft.toLocaleString()}</span> sqft
          </div>
        </div>

        <div className="property-card-amenities">
          {property.amenities.slice(0, 3).map((amenity, i) => (
            <span key={i} className="amenity-tag">{amenity}</span>
          ))}
        </div>

        <div className="property-card-actions">
          <button
            className={`btn-save ${isSaved ? "saved" : ""}`}
            onClick={() => onSave(property)}
          >
            {isSaved ? <IoBookmark /> : <IoBookmarkOutline />}
            {isSaved ? "Saved" : "Save"}
          </button>
          <button
            className={`btn-compare ${isComparing ? "selected" : ""}`}
            onClick={() => onCompare(property)}
          >
            <IoGitCompare />
            {isComparing ? "Selected" : "Compare"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;
