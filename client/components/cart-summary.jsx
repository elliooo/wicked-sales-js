import React from 'react';
import CartSummaryItem from './cart-summary-item';

const CartSummary = props => {
  const backToCatalogButtonStyle = {
    cursor: 'pointer'
  };

  const cartItemPrices = props.cartItems.map(cartItem => cartItem.price);
  const cartSubtotal = '$' + (cartItemPrices.reduce((subtotal, value) => subtotal + value) / 100).toFixed(2);

  const cartElement = props.cartItems.length === 0
    ? <h1 className="d-flex justify-content-center">Your cart is empty.</h1>
    : props.cartItems.map(cartItem => <CartSummaryItem item={cartItem} key={cartItem.cartItemId} />);

  return (
    <div className="container-fluid cart-summary-container">
      <div className="row d-flex justify-content-center">
        <div className="col-10">
          <div
            className="text-muted"
            style={backToCatalogButtonStyle}
            onClick={() => props.setView('catalog', {})}>
            {'<'} Back to Catalog
          </div>
          <div className="container-fluid">
            <div className="row">
              <h1 className="col text-left p-0">My Cart</h1>
              <h1 className="col text-right p-0">Subtotal: {cartSubtotal}</h1>
            </div>
          </div>
          { cartElement }
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
