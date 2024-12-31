import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const Categories = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [categories, setCategories] = useState([]);
  const categoryImages = {
      "hall": "/hall.jpg",
      "pool": "/pool.jpg",
      "stadium": "/stadium.jpg",
      "picnic site": "/picnicsite.jpg",
      "conference room": "/conferencehall.jpg",
      "indoor pitch": "/indoorpitch.jpg",
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/amenities/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);


  return (
    <div className="container mx-auto my-16 px-4">
      <h2 className="text-2xl text-primary font-bold mb-8 mt-28">Explore Categories</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Scrollable Categories */}
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="min-w-[250px] h-[150px] flex-shrink-0 bg-cover bg-center rounded-lg shadow-md relative zoom-image"
                style={{ backgroundImage: `url(${categoryImages[category.name]})` }}
              >
                <div className="absolute text-offwhite shadow-sm inset-0 bg-black bg-opacity-95 rounded-lg flex flex-col justify-center items-center">
                  <h3 className="text-white text-lg font-semibold uppercase">
                    {category.name}
                  </h3>
                  <button
                    onClick={() =>
                      window.location.href = `/discover/${category.id}`
                    }
                    className="mt-2 px-4 py-2 text-white font-medium rounded-full hover:bg-primary hover:text-white transition-all"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 w-full">
              No categories available at the moment.
            </p>
          )}
        </div>
      </div>
  );
};

export default Categories;
