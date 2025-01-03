import React, { useEffect, useState } from "react";
import { useParams } from 'react-router';
import "./ProductPage.css";
import ToggleSwitch from "../ToggleComponent/SwitchToggle";

const ProductPage = ({products, isCartVisible, setCartItems}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const params = useParams();
  const [productElement, setProductElement] = useState();
  const [product, setProduct] = useState({
    title: "",
    price: `$${0}`,
    images: [],
    description: "",
    attributes: [],
  });
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
                product(id: "${params.id}") {
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
            `
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setProduct({
            title: data.data.product?.name ?? '',
            price: `$${data.data.product?.prices[0].amount ?? 0}`,
            images: data.data.product?.gallery ?? [],
            description: data.data.product?.description,
            attributes: data.data.product?.attributes ?? [],
          });
          setProductElement(data.data.product);
        } else {
          console.error("Failed to fetch data:", data.errors);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);
  
  const [selectedAttr, setSelectedAttr] = useState({});

  const setPrevPage = () => {
    if(selectedImage === 0) {
        return;
    } else {
        setSelectedImage(selectedImage - 1);
    }
  }

  const setNextPage = () => {
    if(selectedImage === product.images.length-1) {
        return;
    } else {
        setSelectedImage(selectedImage + 1);
    }
  }

  const setAttributeValue = (attributeName, attribute) => {
    let selectedAttrUpdated = selectedAttr;
    selectedAttrUpdated[attributeName] = attribute.id
    setSelectedAttr(selectedAttrUpdated);
    setProduct({...product});
  }

  const isSelected = (attributeName, attribute) => {
    if(selectedAttr.hasOwnProperty(attributeName)) {
        return selectedAttr[attributeName] == attribute.id ? 'selected' : '';
    }
    return  '';
  } 

  const addToCart = () => {
    productElement['selectedAttributes'] = selectedAttr;
    setCartItems(productElement)
  }
  return (
    <div className="product-page">
      <div className="product-container">
        {/* Left Sidebar */}
        <div className="image-thumbnails">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => setSelectedImage(index)}
              className={selectedImage === index ? "active" : ""}
            />
          ))}
        </div>

        {/* Main Image */}
        <div className="main-image">
          <button className="arrow left" onClick={() => setPrevPage()}>&#8592;</button>
          <img src={product.images[selectedImage]} alt="Selected" />
          <button className="arrow right" onClick={() => setNextPage()}>&#8594;</button>
        </div>

        {/* Product Details */}
        <div className="product-details">
          <h1>{product.title}</h1>

          {product.attributes.map((attribute, index) => (
            <div className={`product-${attribute.name.toLowerCase()}`} key={index}>
                <strong>{attribute.name.toUpperCase()}:</strong>
                {attribute.items.map((size, idx) => (<button className={isSelected(attribute.name, size)} key={idx} onClick={() => setAttributeValue(attribute.name, size)}>{size.value}</button>))}
            </div>
          ))}

          {/* <ToggleSwitch /> */}

          <p className="product-price">
            <strong>PRICE:</strong> {product.price}
          </p>

          <button className="add-to-cart-page" onClick={addToCart}>ADD TO CART</button>

          <p className="product-description" dangerouslySetInnerHTML={{__html: product.description}}/>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
