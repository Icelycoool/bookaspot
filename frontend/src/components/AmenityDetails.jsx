import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AmenityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [amenity, setAmenity] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    comment: '',
    rating: 0
  });

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/amenities/${id}`)
      .then((response) => setAmenity(response.data))
      .catch((error) => console.error('Error fetching amenity details:', error));

    axios
      .get(`${apiUrl}/api/reviews/amenity/${id}`)
      .then((response) => setReviews(response.data))
      .catch((error) => console.error('Error fetching reviews:', error));
  }, [id, apiUrl]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const reviewData = {
      amenity_id: id,
      rating: newReview.rating,
      comment: newReview.comment
    };

    axios
      .post(`${apiUrl}/api/reviews`, reviewData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setReviews((prevReviews) => [...prevReviews, response.data]);
        setNewReview({ comment: '', rating: 0 });
      })
      .catch((error) => console.error('Error submitting review:', error));
  };

  const handleBookNow = () => {
    navigate(`/bookings/new?amenityId=${id}&pricePerHour=${amenity.price_per_hour}`);
  };

  if (!amenity) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 mt-28 mb-36">
      {/* Amenity Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative h-64">
            {amenity.images && amenity.images.length > 0 ? (
              <img
                src={`${apiUrl}/api/amenities_images/${amenity.images[0]}`}
                alt={amenity.name}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md">
                <span>No Image Available</span>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">{amenity.name}</h1>
            <p className="text-gray-700 mt-2">{amenity.description}</p>
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-yellow-500 text-xl">⭐</span>
              <span className="text-gray-600 text-lg">
                {amenity.rating ? amenity.rating.toFixed(1) : 'N/A'}
              </span>
            </div>
            {/* Display the price per hour */}
            <div className="mt-4 text-xl font-semibold text-gray-800">
              Price per hour: KES{amenity.price_per_hour.toFixed(2)}
            </div>
            <button
              onClick={handleBookNow}
              className="mt-4 bg-secondary text-offwhite py-2 px-6 rounded hover:bg-secondaryHover"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-50 p-4 rounded border border-gray-200"
              >
                <h3 className="text-lg font-semibold first-letter:uppercase">
                  {review.username}
                </h3>
                <p className="text-sm text-gray-600">{review.comment}</p>
                <div className="flex items-center space-x-1 mt-2">
                  <span className="text-yellow-500 text-sm">⭐</span>
                  <span className="text-sm text-gray-600">{review.rating}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No reviews yet. Be the first to review!</p>
          )}
        </div>

        {/* Review Form */}
        <form
          onSubmit={handleReviewSubmit}
          className="mt-6 bg-gray-100 p-4 rounded-lg"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Leave a Review
          </h3>
          <div className="mb-4">
            <label htmlFor="comment" className="block text-gray-600">
              Your Comment
            </label>
            <textarea
              id="comment"
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              className="w-full p-2 border rounded"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="rating" className="block text-gray-600">
              Your Rating
            </label>
            <input
              type="number"
              id="rating"
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: Number(e.target.value) })
              }
              className="w-full p-2 border rounded"
              min="0"
              max="5"
              step="0.1"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-offwhite py-2 px-6 rounded hover:bg-primaryHover"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default AmenityDetails;
