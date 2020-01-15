import React from 'react';

const Header = props => {
  return (
    <div className="container-fluid mb-3">
      <div className="row bg-dark text-light p-2 d-flex align-items-center">
        <div className="col-10 pl-5">
          <h2><span className="fas fa-dollar-sign" /> Wicked Sales</h2>
        </div>
        <div className="col-2">
          <h4>
            {props.cartItemCount} Items
            <span
              className="fas fa-shopping-cart"
              style={{ cursor: 'pointer' }}
              onClick={() => props.setView('cart', {})}>
            </span>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Header;
