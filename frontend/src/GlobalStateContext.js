import React, { createContext, useContext, useState, useEffect } from "react";

// Create contexts
const GlobalStateContext = createContext();
const GlobalStateUpdateContext = createContext();

// Custom hooks for easier access
export const useGlobalState = () => useContext(GlobalStateContext);
export const useGlobalStateUpdate = () => useContext(GlobalStateUpdateContext);

export const GlobalStateProvider = ({ children }) => {
  // Retrieve cart from sessionStorage only on first render
  const getInitialCart = () => {
    try {
      const storedCart = sessionStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error parsing cart from sessionStorage:", error);
      return [];
    }
  };

  // Initialize state
  const [globalState, setGlobalState] = useState(() => ({
    isLoggedIn: false,
    cart: getInitialCart(), // Load cart on app start
  }));

  // Ensure sessionStorage updates whenever the cart changes
  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(globalState.cart));
  }, [globalState.cart]);

  return (
    <GlobalStateContext.Provider value={globalState}>
      <GlobalStateUpdateContext.Provider value={setGlobalState}>
        {children}
      </GlobalStateUpdateContext.Provider>
    </GlobalStateContext.Provider>
  );
};
