import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Cart from "./Cart";
import HeaderComponent from "./components/HeaderComponent";
import HomePage from "./components/HomeComponent/HomePage";
import ProductPage from "./components/ProductPageComponent/ProductPage";
import { useGlobalState, useGlobalStateUpdate } from "./GlobalStateContext";

function App() {
  const { cart } = useGlobalState(); // Get cart from global state
  const setGlobalState = useGlobalStateUpdate(); // Function to update global state

  const [categories, setCategories] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://scandiweb-backend-mvc9.onrender.com/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query {
                categories {
                  id
                  name
                }
              }
            `,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setCategories(data.data.categories);
        } else {
          console.error("Failed to fetch data:", data.errors);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  // Toggle cart visibility
  const showCart = () => {
    setIsCartVisible(!isCartVisible);
  };

  // Ensure deep copy of objects before modifying state
  const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

  // Add item to cart in global state
  const addToCart = (item) => {
    setGlobalState((prevState) => ({
      ...prevState,
      cart: [...deepCopy(prevState.cart), deepCopy(item)],
    }));
    setIsCartVisible(true);
  };

  // Remove a single instance of an identical item from the cart
  const removeSingleIdenticalItem = (items, objectToRemove) => {
    let found = false;
    return items.filter((item) => {
      if (found) return true; // Keep remaining items after removing first match

      const isSameId = item.id === objectToRemove.id;
      const isSameAttributes =
        JSON.stringify(item.selectedAttributes) === JSON.stringify(objectToRemove.selectedAttributes);

      if (isSameId && isSameAttributes && !found) {
        found = true; // Mark as found and remove this item
        return false;
      }
      return true;
    });
  };

  // Handle cart updates (add/remove items)
  const updateItems = (action, item) => {
    if (action === "add") {
      delete item.quantity;
      addToCart(item);
    } 
    if (action === "remove") {
      setGlobalState((prevState) => ({
        ...prevState,
        cart: removeSingleIdenticalItem(prevState.cart, item),
      }));
    }
  };

  // Clear entire cart
  const clearCart = () => {
    setGlobalState((prevState) => ({
      ...prevState,
      cart: [],
    }));
  };

  return (
    <div className="App">
      <HeaderComponent categories={categories} size={cart.length} showCart={showCart} />
      {isCartVisible && <Cart items={cart} updateItems={updateItems} clearCart={clearCart} />}
      <Routes>
        <Route path="/" element={<HomePage isCartVisible={isCartVisible} setCartItems={addToCart} />} />
        <Route path="/:category" element={<HomePage isCartVisible={isCartVisible} setCartItems={addToCart} />} />
        <Route path="/product/:id" element={<ProductPage setCartItems={addToCart} />} />
      </Routes>
    </div>
  );
}

export default App;
