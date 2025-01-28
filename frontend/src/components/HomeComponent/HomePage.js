import React, { useEffect, useState } from "react";
import { useParams } from 'react-router';
import ProductCard from "../../ProductCard";

const HomePage = ({isCartVisible, category}) => {
    const [products, setProducts] = useState([]);
    const params = useParams();
    const header = params?.category ?? "all";
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch("https://scandiweb-backend-mvc9.onrender.com/graphql", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: `
                  query {
                    products(category: "${header}") {
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
              setProducts(data.data.products);
            } else {
              console.error("Failed to fetch data:", data.errors);
            }
          } catch (error) {
            console.error("Error:", error);
          }
        };
    
        fetchData();
      }, [header]);
    return (<main className={`main ${isCartVisible ? 'blur': ''}`}>
        <h1>{header.toUpperCase()}</h1>
        <div className="product-list">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.prices[0]}
              image={product.gallery[0]}
              inStock={product.inStock}
            />
          ))}
        </div>
    </main>)
}

export default HomePage;