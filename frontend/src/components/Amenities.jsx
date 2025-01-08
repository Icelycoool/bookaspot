import { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit, Plus, Trash2 } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Amenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_per_hour: '',
    address: '',
    category: '',
    images: []
  });

  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {
    fetchAmenities();
    fetchCategories();
  }, []);

  const fetchAmenities = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/amenities`);
      setAmenities(response.data);
    } catch (error) {
      console.error('Error fetching amenities:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/amenities/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === 'images') {
        formData.images.forEach((image) => {
          formPayload.append('images', image);
        });
      } else {
        formPayload.append(key, formData[key]);
      }
    });

    try {
      if (selectedAmenity) {
        await axios.put(
          `${apiUrl}/api/amenities/${selectedAmenity.id}`,
          formPayload,
          { headers: { ...headers, 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        await axios.post(
          `${apiUrl}/api/amenities`,
          formPayload,
          { headers: { ...headers, 'Content-Type': 'multipart/form-data' } }
        );
      }
      fetchAmenities();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving amenity:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this amenity?')) {
      try {
        await axios.delete(`${apiUrl}/api/amenities/${id}`, { headers });
        fetchAmenities();
      } catch (error) {
        console.error('Error deleting amenity:', error);
      }
    }
  };

  const handleEdit = (amenity) => {
    setSelectedAmenity(amenity);
    setFormData({
      name: amenity.name,
      description: amenity.description,
      price_per_hour: amenity.price_per_hour,
      address: amenity.address,
      category: amenity.category_id,
      images: []
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price_per_hour: '',
      address: '',
      category: '',
      images: []
    });
    setSelectedAmenity(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-28 mb-48">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Amenities</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-offwhite px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Add Amenity
        </button>
      </div>

      {/* Amenities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {amenities.map((amenity) => (
          <div key={amenity.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {amenity.images?.length > 0 && (
              <img
                src={`${apiUrl}/api/amenities_images/${amenity.images[0]}`}
                alt={amenity.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl text-primary font-semibold">{amenity.name}</h2>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-xl"> ⭐{amenity.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-2">{amenity.description}</p>
              <p className="text-gray-500 text-sm mb-4">{amenity.address}</p>
              <p className="text-secondary font-bold mb-2">KES. {amenity.price_per_hour}/hour</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(amenity)}
                  className="p-2  text-primary hover:bg-primary hover:text-offwhite rounded-full"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(amenity.id)}
                  className="p-2 text-secondary hover:bg-secondary hover:text-offwhite rounded-full"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-offwhite bg-opacity-95 flex items-center justify-center p-4">
          <div className="bg-offwhite rounded-lg shadow-lg p-6 w-full max-w-xl">
            <h2 className="text-2xl font-bold mb-4">
              {selectedAmenity ? 'Edit Amenity' : 'Add New Amenity'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price per Hour</label>
                <input
                  type="number"
                  value={formData.price_per_hour}
                  onChange={(e) => setFormData({ ...formData, price_per_hour: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFormData({ ...formData, images: Array.from(e.target.files) })}
                  className="w-full p-2 border rounded-lg"
                  accept="image/*"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-offwhite rounded-lg"
                >
                  {selectedAmenity ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Amenities;
