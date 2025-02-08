// model.js

let foodDatabase = []; // Initialize an empty array for the food database

// Function to load food data asynchronously from a JSON file
const loadFoodData = async () => {
  try {
    const response = await fetch('foodData.json'); // Path to the JSON file
    if (!response.ok) throw new Error('Failed to load food data');
    foodDatabase = await response.json();
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

// Function to get food by code
const getFoodByCode = (code) => {
  return foodDatabase.find(item => item.code === code);
};

// Call loadFoodData() to load the food data when the page loads
loadFoodData();

export { getFoodByCode };
