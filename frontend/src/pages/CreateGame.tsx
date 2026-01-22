import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { CreateGameRequest } from '../services/api';

export const CreateGame = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateGameRequest>({
    name: '',
    photoUrl: '',
    price: 0,
    discount: 0,
    keyType: '',
    creatorEmail: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'discount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      if (formData.price <= 0) {
        throw new Error('Price must be greater than 0');
      }
      if (!formData.keyType.trim()) {
        throw new Error('Key Type is required');
      }
      if (!formData.creatorEmail.trim()) {
        throw new Error('Creator Email is required');
      }

      await api.createGame(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to create game. Please try again.');
      console.error('Error creating game:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F1E] py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-purple-400 hover:text-purple-300 mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Gallery
          </button>
          <h1 className="text-3xl font-bold text-white">Create New Game Listing</h1>
          <p className="text-gray-400 mt-2">Add a new game key to the marketplace</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#1A1A2E] border border-[#2D2D44] rounded-lg p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Game Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#0F0F1E] border border-[#2D2D44] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#6B46C1] focus:ring-2 focus:ring-[#6B46C1]/20"
              placeholder="e.g., Split Fiction"
            />
          </div>

          {/* Photo URL */}
          <div>
            <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-300 mb-2">
              Photo URL
            </label>
            <input
              type="url"
              id="photoUrl"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              className="w-full bg-[#0F0F1E] border border-[#2D2D44] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#6B46C1] focus:ring-2 focus:ring-[#6B46C1]/20"
              placeholder="https://example.com/game-image.jpg"
            />
          </div>

          {/* Price and Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
                Price (€) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-[#0F0F1E] border border-[#2D2D44] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#6B46C1] focus:ring-2 focus:ring-[#6B46C1]/20"
                placeholder="49.99"
              />
            </div>

            <div>
              <label htmlFor="discount" className="block text-sm font-medium text-gray-300 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                id="discount"
                name="discount"
                min="0"
                max="100"
                step="1"
                value={formData.discount}
                onChange={handleChange}
                className="w-full bg-[#0F0F1E] border border-[#2D2D44] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#6B46C1] focus:ring-2 focus:ring-[#6B46C1]/20"
                placeholder="0"
              />
            </div>
          </div>

          {/* Key Type */}
          <div>
            <label htmlFor="keyType" className="block text-sm font-medium text-gray-300 mb-2">
              Type of Key <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="keyType"
              name="keyType"
              required
              value={formData.keyType}
              onChange={handleChange}
              className="w-full bg-[#0F0F1E] border border-[#2D2D44] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#6B46C1] focus:ring-2 focus:ring-[#6B46C1]/20"
              placeholder="e.g., Steam, Epic Games, Xbox Live"
            />
          </div>

          {/* Creator Email */}
          <div>
            <label htmlFor="creatorEmail" className="block text-sm font-medium text-gray-300 mb-2">
              Creator Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              id="creatorEmail"
              name="creatorEmail"
              required
              value={formData.creatorEmail}
              onChange={handleChange}
              className="w-full bg-[#0F0F1E] border border-[#2D2D44] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#6B46C1] focus:ring-2 focus:ring-[#6B46C1]/20"
              placeholder="seller@example.com"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 bg-[#2D2D44] hover:bg-[#3D3D54] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#6B46C1] hover:bg-[#7C3AED] disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Publishing...' : 'Publish Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
