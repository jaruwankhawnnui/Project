// import React, { useState, useEffect } from 'react';
// import CreateCategory from './CreateCategory';
// import Cartadmin from './Cartadmin';

// const CategoryManager = () => {
//   const [categories, setCategories] = useState([]);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get("http://172.26.128.1:1337/api/categoriesadmins");
//       setCategories(response.data.data); // Ensure this updates the categories state correctly
//     } catch (error) {
//       console.error("Failed to fetch categories:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const handleNewCategoryAdded = () => {
//     fetchCategories(); // Refresh categories after a new category is added
//   };

//   return (
//     <div>
//       {/* Pass the handleNewCategoryAdded function as a prop */}
//       <CreateCategory onNewCategoryAdded={handleNewCategoryAdded} />
//       <Cartadmin categories={categories} />
//     </div>
//   );
// };

// export default CategoryManager;
