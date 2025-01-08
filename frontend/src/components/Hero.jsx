import React, { useEffect, useState } from 'react';
import hero from '../assets/heroimg.jpg';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

const Hero = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [location, setLocation] = useState('');
  const [amenityType, setAmenityType] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/amenities/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleLocationChange = (e) => setLocation(e.target.value);
  const handleAmenityTypeChange = (e) => setAmenityType(e.target.value);
  const handleBookingDateChange = (e) => setBookingDate(e.target.value);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/search`, {
        params: {
          location,
          amenity_type: amenityType,
          booking_date: bookingDate
        }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div className='container m-auto mt-28'>
      <section className="relative text-center bg-cover bg-center h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden mx-4" style={{ backgroundImage: `url(${hero})` }}>
        <div className="absolute inset-0 bg-accent bg-opacity-35"></div>
        <div className="relative z-10 text-white py-16">
          <h1 className="text-3xl md:text-4xl font-bold md:mt-24 text-offwhite">
                        Find your perfect spot with Bookaspot
          </h1>
          <p className="mt-2 px-8 text-offwhite">Discover amenities around you from the comfort of your house!</p>
        </div>
      </section>

      {/* Search Component */}
      <div className="relative -mt-12 z-20 flex justify-center px-4">
        <div className="bg-primary shadow-md rounded-xl px-6 py-4 flex flex-wrap justify-between items-center gap-4 w-full max-w-4xl">
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={handleLocationChange}
            className="px-4 py-2 border border-offwhite rounded-md w-full md:w-[40%]"
          />
          {/* Amenity Type Dropdown */}
          <select
            value={amenityType}
            onChange={handleAmenityTypeChange}
            className="px-4 py-2 border border-offwhite rounded-md w-full md:w-[20%]"
          >
            <option value="">Select Amenity Type</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={bookingDate}
            onChange={handleBookingDateChange}
            className="px-4 py-2 border rounded-md border-offwhite w-full text-primary fill-primary md:w-[20%]"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 text-white bg-offwhite rounded-full w-full md:w-auto"
          >
            <FaSearch size={24} className='text-primary' />
          </button>
        </div>
      </div>

      {/* Display Search Results */}
      {searchResults.length > 0 && (
        <div className="container mx-auto mt-8 px-4">
          <h2 className="text-2xl text-primary font-semibold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {searchResults.map((amenity) => (
              <div key={amenity.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <img src={`${apiUrl}/api/amenities_images/${amenity.image_url}`} alt={amenity.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{amenity.name}</h3>
                  <p className="text-gray-600">{amenity.description}</p>
                  <p className="mt-2"> <span className=" text-md font-semibold">Location:</span> {amenity.address}</p>
                  <p className="mt-2"> <span className="text-md font-semibold">Price: </span>KES. {amenity.price_per_hour} per hour</p>
                  <p className="mt-2"> <span className="text-md font-semibold">Rating: ⭐</span>{amenity.average_rating || 'N/A'}</p>
                  <p className="mt-2"> <span className="text-md font-semibold">Reviews: 💬 </span>{amenity.reviews_count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
