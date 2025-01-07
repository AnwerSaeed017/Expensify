// categories.js
export const categories = [
  { name: 'Food & Drink', icon: 'fast-food-outline', color: '#FF6347' },
  { name: 'Transport', icon: 'car-outline', color: '#4682B4' },
  { name: 'Utilities', icon: 'flash-outline', color: '#FFD700' },
  { name: 'Entertainment', icon: 'film-outline', color: '#8A2BE2' },
  { name: 'Medicine', icon: 'medkit-outline', color: '#FF4500' }, // New Category
  { name: 'Clothes', icon: 'shirt-outline', color: '#1E90FF' }, // New Category
];

// Helper function to get category color
export const getCategoryColor = (categoryName) => {
  const category = categories.find((cat) => cat.name === categoryName);
  return category ? category.color : '#333'; // Default color if category not found
};
