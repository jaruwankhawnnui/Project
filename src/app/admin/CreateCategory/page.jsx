"use client";
import React, { useState } from 'react';
import axios from 'axios';
import Layout from "@/components/Layout";

const CreateCategory = ({ onNewCategoryAdded }) => {
  const [label, setLabel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setLabel(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'http://172.26.32.1:1337/api/categoriesadmins',
        { data: { Label: label } },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Category Created:', response.data);
      setLabel(''); // Clear the input field
      if (onNewCategoryAdded) {
        onNewCategoryAdded(); // Refresh categories list in the parent component
      }
    } catch (error) {
      console.error('Failed to create category:', error.response?.data || error.message);
      setError('Failed to create category. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-gray-100 w-full flex flex-col min-h-screen'>
    <Layout>
      <div className="max-w-md mx-auto mt-5 bg-white shadow-md rounded-md p-6">
        <h1 className="text-2xl font-bold mb-6">Create Category</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="label">
              Label
            </label>
            <input
              type="text"
              id="label"
              name="label"
              value={label}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>
    </Layout>
    </div>
  );
};

export default CreateCategory;
