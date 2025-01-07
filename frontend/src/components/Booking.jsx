import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const Booking = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [searchParams] = useSearchParams();
  const amenityId = searchParams.get("amenityId");
  
  const [bookings, setBookings] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isBookingFormVisible, setBookingFormVisible] = useState(true);
  const [message, setMessage] = useState("");
  const [amenityDetails, setAmenityDetails] = useState(null);

  useEffect(() => {
    if (amenityId) {
      axios.get(`${apiUrl}/api/amenities/${amenityId}`)
        .then(response => setAmenityDetails(response.data))
        .catch(error => console.error("Error fetching amenity details:", error));
    }
    fetchBookings();
  }, [amenityId]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/booking`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setMessage(error.response?.data?.message || "Failed to fetch bookings.");
    }
  };

  const handleCreateBooking = async () => {
    if (!startDate || !startTime || !endDate || !endTime) {
      setMessage("Please fill in all date and time fields");
      return;
    }

    const startDateTime = `${startDate}T${startTime}`;
    const endDateTime = `${endDate}T${endTime}`;

    if (new Date(endDateTime) <= new Date(startDateTime)) {
      setMessage("End time must be after start time");
      return;
    }

    const bookingData = {
      amenity_id: amenityId,
      start_date: startDateTime,
      end_date: endDateTime,
    };

    try {
      await axios.post(`${apiUrl}/api/booking`, bookingData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage("Booking created successfully!");
      fetchBookings();
      setStartDate("");
      setStartTime("");
      setEndDate("");
      setEndTime("");
    } catch (error) {
      console.error("Error creating booking:", error);
      setMessage(error.response?.data?.message || "Failed to create booking.");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await axios.delete(`${apiUrl}/api/booking/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage("Booking deleted successfully!");
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
      setMessage(error.response?.data?.message || "Failed to delete booking.");
    }
  };

  return (
    <div className="booking-system container mx-auto mt-28 mb-96 px-4">
      <h1 className="text-3xl font-bold text-center text-primary mb-6 uppercase">Booking System</h1>
      {amenityDetails && (
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold">Booking for: {amenityDetails.name}</h2>
          <p className="text-accent">Price: KES{amenityDetails.price_per_hour}/hr</p>
        </div>
      )}
      {message && (
        <p className={`text-center ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}

      {isBookingFormVisible && (
        <div className="bg-gray-100 p-6 rounded-md shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">Create a Booking</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  min={startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleCreateBooking}
                className="bg-primary text-offwhite py-2 px-4 rounded hover:bg-primaryHover"
              >
                Create Booking
              </button>
              <button
                onClick={() => setBookingFormVisible(false)}
                className="bg-secondary text-offwhite py-2 px-4 rounded hover:bg-secondaryHover"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>
      {bookings.length > 0 ? (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="bg-offwhite p-4 rounded-md shadow-md"
            >
              <p>
                <strong>Amenity:</strong> {booking.amenity}
              </p>
              <p>
                <strong>Start:</strong> {booking.start_time}
              </p>
              <p>
                <strong>End:</strong> {booking.end_time}
              </p>
              <p>
                <strong>Status:</strong> {booking.status}
              </p>
              {booking.qr_code && (
                <img
                  src={`${apiUrl}/api/bookings_qr/${booking.qr_code}`}
                  alt="Booking QR Code"
                  className="mt-2 w-48 h-48"
                />
              )}
              <button
                onClick={() => handleDeleteBooking(booking.id)}
                className="bg-secondary text-offwhite py-1 px-3 rounded mt-4 hover:bg-secondaryHover"
              >
                Delete
              </button>

            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No bookings available.</p>
      )}
    </div>
  );
};

export default Booking;