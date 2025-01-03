import React, { createContext, useContext, useState } from "react";

// Create contexts
const GlobalStateContext = createContext();
const GlobalStateUpdateContext = createContext();

// Custom hooks for easier access
export const useGlobalState = () => useContext(GlobalStateContext);
export const useGlobalStateUpdate = () => useContext(GlobalStateUpdateContext);

export const GlobalStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    isLoggedIn: false, // Example global state
    cartItems: [],     // Cart items globally shared
    theme: "light",    // Theme toggle
  });

  // Update state function (merge updates into the current state)
  const updateGlobalState = (updates) => {
    setGlobalState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <GlobalStateContext.Provider value={globalState}>
      <GlobalStateUpdateContext.Provider value={updateGlobalState}>
        {children}
      </GlobalStateUpdateContext.Provider>
    </GlobalStateContext.Provider>
  );
};
