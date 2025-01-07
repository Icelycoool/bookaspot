import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Amenitiescard = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [amenities, setAmenities] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/amenities`)
      .then((response) => {
        // Ensure response data is valid
        if (Array.isArray(response.data)) {
          setAmenities(response.data);
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching amenities:", error));
  }, [apiUrl]);

  return (
    <div className="container m-auto px-4">
      <h2 className="text-2xl text-primary font-bold mb-8 mt-16">Discover Amenities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {amenities.map((amenity) => (
          <div key={amenity.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              {amenity.images && amenity.images.length > 0 ? (
                <img
                  src={`${apiUrl}/api/amenities_images/${amenity.images[0]}`}
                  alt={amenity.name || "Amenity"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span>No Image</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800"><Link
                  to={`amenities/${amenity.id}`}
                  className="text-primary hover:underline"
                >
                  {amenity.name || "Unknown"}
                </Link></h3>
              <p className="text-sm text-gray-600">
                {amenity.description || "No description available"}
              </p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-secondary text-lg font-semibold">
                  KES{amenity.price_per_hour || "0.00"}/hr
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500 text-sm">⭐</span>
                  <span className="text-sm text-gray-600">
                    {amenity.rating ? amenity.rating.toFixed(1) : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
    </div>
  );
};

export default Amenitiescard;
