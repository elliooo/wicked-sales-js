import React from 'react';

const CartSummaryItem = props => {
  const imageStyle = {
    height: 300,
    objectFit: 'contain'
  };
  return (
    <div className="card mb-3 p-3">
      <div className="container-fluid">
        <div className="row d-flex justify-content-around">
          <img className="col-4" src={props.item.image} style={imageStyle} alt="product image" />
          <div className="col-6 d-flex flex-column justify-content-center">
            <h5 className="card-title mb-3">{props.item.name}</h5>
            <h6 className="card-subtitle text-muted mb-2">{'$' + (props.item.price / 100).toFixed(2)}</h6>
            <p className="card-text">{props.item.shortDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummaryItem;
