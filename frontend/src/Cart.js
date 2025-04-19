import React from "react";
import "./Cart.css";


const Cart = ({ items, updateItems, clearCart }) => {
    const total = items.reduce((accumulator, current) => {
        return accumulator + current?.prices[0].amount
    }, 0);

    const isSelected = (attr, selectedAttributes, attrName) => {
        if(attr.display_value === selectedAttributes[attrName]) {
            return 'selected';
        }
        return  '';
    }

    const isYesNo = (item) => {
      return (item.value.toLowerCase() === "yes" || item.value.toLowerCase() === "no") ? "yes-no" : null;
    }

    const filterDistinctItemsWithQuantity = (items) => {
        const uniqueItemsMap = new Map();
        items.forEach((item) => {
          const uniqueKey = `${item.id}-${JSON.stringify(item.selectedAttributes)}`;
          if (uniqueItemsMap.has(uniqueKey)) {
            uniqueItemsMap.get(uniqueKey).quantity += 1;
          } else {
            uniqueItemsMap.set(uniqueKey, { ...item, quantity: 1 });
          }
        });
        return Array.from(uniqueItemsMap.values());
    };

    const addOneMore = (item) => {
        updateItems("add", item);
    }

    const removeOneMore = (item) => {
        updateItems("remove", item);
    }

    const uniqueItems = filterDistinctItemsWithQuantity(items);

    const isNotColor = (attributeName) => {
      return attributeName !== 'color';
    }

    const placeOrder = () => {
      const mutationQuery = `
        mutation {
          placeOrder(orders: [${uniqueItems.map((order) => {
            return `{
              product_id: "${order.id}",
              quantity: ${order.quantity},
              selectedAttributes: "${JSON.stringify(order.selectedAttributes).replace(/"/g, '\\"')}"
            }`
          }).join(', ')}])
        }
      `;

      fetch("https://scandiweb-backend-mvc9.onrender.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({query: mutationQuery}),
      }).then((res) => res.json())
      .then((data) => {
        if(data.data.placeOrder === "success") {
          clearCart();
        }
      })
      .catch((err) => console.error(err));
    }
    return (
    <div className="cart-container" data-testid='cart-overlay'>
      <h2 className="cart-title">My Bag, {items.length} items</h2>
      <div className="cart-items">
        {uniqueItems.map((item, index) => (
          <div className="cart-item" key={index}>
            <div className="cart-item-details">
              <div className="top-row">
                <h3 className="item-name">{item.name}</h3>
                <button className="quantity-button" onClick={() => addOneMore(item)} data-testid='cart-item-amount-increase'>+</button>
              </div>
              <div className="top-row">
                <p className="item-price">${item.prices[0].amount.toFixed(2)}</p>
                <p className="item-quantity" data-testid='cart-item-amount'>{item.quantity}</p>
              </div>
              {item.attributes && item.attributes.map((attribute, i) => 
                <div className={`${attribute.name.toLowerCase()}-options`} key={i} data-testid={`cart-item-attribute-${attribute.name}`}>
                    <p>{attribute.name}:</p>
                    {attribute.items.map((attr, idx) => {
                    return (
                    <button
                        key={idx}
                        className={`${isYesNo(attr) ?? attribute.name.toLowerCase()}-button ${isSelected(attr, item.selectedAttributes, attribute.name)}`}
                        data-testid={`product-attribute-${attribute.name.toLowerCase()}-${attr.value}`}
                        style={isNotColor(attribute.name.toLowerCase()) ? {} : {backgroundColor: attr.value}}
                    >
                        {isNotColor(attribute.name.toLowerCase()) ? attr.value : ""}
                    </button>
                    )})}
                </div>
              )}
              <div className="bottom-row">
                <button className="quantity-button" onClick={() => removeOneMore(item)} data-testid='cart-item-amount-decrease'>-</button>
              </div>
            </div>
            <img src={item.gallery[0]} alt={item.name} className="cart-item-image" />
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <div className="total">
          <p>Total</p>
          <p data-testid='cart-total'>${total.toFixed(2)}</p>
        </div>
        <button className="place-order-button" onClick={() => placeOrder()}>PLACE ORDER</button>
      </div>
    </div>
  );
};

export default Cart;
