import "./Compare.css";

function Compare({ compareProperties, onCompare }) {
  return (
    <div className="compare-page">
      <div className="container">
        <div className="section-header">
          <h2>
            <span className="gradient-text">Compare Properties</span>
          </h2>
          <p>
            {compareProperties.length > 0
              ? `Comparing ${compareProperties.length} properties side by side`
              : "Select properties to compare them"}
          </p>
        </div>

        {compareProperties.length === 0 ? (
          <div className="compare-empty">
            <div className="empty-icon">📊</div>
            <p>No properties selected for comparison. Click "Compare" on any property card!</p>
          </div>
        ) : (
          <div className="compare-table-wrapper">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  {compareProperties.map((p) => (
                    <th key={p.id}>{p.title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Image</strong></td>
                  {compareProperties.map((p) => (
                    <td key={p.id}>
                      <img className="prop-image" src={p.image_url} alt={p.title} />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Price</strong></td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="price-cell">${p.price.toLocaleString()}</td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Location</strong></td>
                  {compareProperties.map((p) => (
                    <td key={p.id}>{p.location}</td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Bedrooms</strong></td>
                  {compareProperties.map((p) => (
                    <td key={p.id}>{p.bedrooms}</td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Bathrooms</strong></td>
                  {compareProperties.map((p) => (
                    <td key={p.id}>{p.bathrooms}</td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Size</strong></td>
                  {compareProperties.map((p) => (
                    <td key={p.id}>{p.size_sqft.toLocaleString()} sqft</td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Amenities</strong></td>
                  {compareProperties.map((p) => (
                    <td key={p.id}>
                      {p.amenities.map((a, i) => (
                        <span key={i} className="amenity-tag">{a}</span>
                      ))}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Action</strong></td>
                  {compareProperties.map((p) => (
                    <td key={p.id}>
                      <button className="btn-remove-compare" onClick={() => onCompare(p)}>
                        Remove
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Compare;
