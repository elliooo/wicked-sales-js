import React from 'react';
import ProductListItem from './product-list-item';

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  getProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => this.setState({ products: data }));
  }

  componentDidMount = () => {
    this.getProducts();
  }

  render = () => {
    return (
      <div className="container-fluid">
        <div className="row">
          {this.state.products.map(product => {
            return (
              <div className="col-sm-12 col-md-6 col-lg-4" key={product.productId}>
                <ProductListItem
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  shortDescription={product.shortDescription}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
