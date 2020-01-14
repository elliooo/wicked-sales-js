import React from 'react';

const ProductListItem = props => {
  const cardStyle = {
    height: 400,
    cursor: 'pointer'
  };
  const imageStyle = {
    height: 200,
    objectFit: 'contain'
  };
  return (
    <div
      className="card mb-3 mx-3"
      style={cardStyle}
      onClick={() => props.setView('details', { productId: props.productId })}>
      <img
        src={props.image}
        className="card-img-top"
        style={imageStyle}
        alt="Busted"
      />
      <div className="card-body d-flex flex-column justify-content-around">
        <h5 className="card-title">{props.name}</h5>
        <h6 className="card-subtitle text-muted">{'$' + (props.price / 1000).toFixed(2)}</h6>
        <p className="card-text">{props.shortDescription}</p>
      </div>
    </div>
  );
};

export default ProductListItem;
