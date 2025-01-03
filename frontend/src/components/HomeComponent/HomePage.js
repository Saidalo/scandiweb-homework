import React from "react";
import ProductCard from "../../ProductCard";

const HomePage = ({isCartVisible, products, category}) => {
    const header = category?.name ?? "";
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