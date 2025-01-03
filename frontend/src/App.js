import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Cart from "./Cart";
import HeaderComponent from "./components/HeaderComponent";
import HomePage from "./components/HomeComponent/HomePage";
import ProductPage from "./components/ProductPageComponent/ProductPage";

function App() {

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [cart, setCart] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query {
                categories {
                  id
                  name
                },
                products {
                  id
                  name
                  inStock
                  gallery
                  description
                  category
                  attributes {
                    id
                    items {
                      display_value
                      value
                      id
                    }
                    name
                    type
                  }
                  prices {
                    amount
                    currency
                  }
                  brand
                }
              }
            `,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setCategories(data.data.categories);
          setProducts(data.data.products);
        } else {
          console.error("Failed to fetch data:", data.errors);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);
  
  const showCart = () => {
    setIsCartVisible(!isCartVisible);
  }


  const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

  const addToCart = (item) => {
    setCart([...deepCopy(cart), deepCopy(item)]);
  }


  const removeSingleIdenticalItem = (items, objectToRemove) => {
    let found = false;
  
    return items.filter((item) => {
      if (found) return true; // Keep all subsequent items after the first match is removed
  
      const isSameId = item.id === objectToRemove.id;
      const isSameAttributes =
        JSON.stringify(item.selectedAttributes) ===
        JSON.stringify(objectToRemove.selectedAttributes);
  
      if (isSameId && isSameAttributes && !found) {
        found = true; // Mark the match as found
        return false; // Remove this item
      }
  
      return true; // Keep other items
    });
  };

  const updateItems = (action, item) => {
    if (action === "add") {
      delete item.quantity;
      addToCart(item);
    } 

    if(action === "remove") {
      setCart(removeSingleIdenticalItem(cart, item));
    }
  }

  const clearCart = () => {
    setCart([]);
  }

  return (
    <div className="App">
      <HeaderComponent categories={categories} size={cart.length} showCart={showCart} />
      {isCartVisible && <Cart items={cart} updateItems={updateItems} clearCart={clearCart}/>}
      <Routes>
        <Route path="/" element={<HomePage isCartVisible={isCartVisible} products={products} category={categories[0]} />} />
        <Route path="/product/:id" element={<ProductPage isCartVisible={isCartVisible} products={products} setCartItems={addToCart}/>} />
      </Routes>
    </div>
  );
}

export default App;
