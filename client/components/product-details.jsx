import React from 'react';

export default class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      isLoading: true
    };
  }

  componentDidMount = () => {
    fetch(`/api/products/${this.props.viewParams.productId}`)
      .then(res => res.json())
      .then(data => this.setState({
        product: data,
        isLoading: false
      }));
  }

  render = () => {
    const imageStyle = {
      objectFit: 'contain',
      height: 400
    };
    const backToCatalogButtonStyle = {
      cursor: 'pointer'
    };

    return this.state.isLoading
      ? <div>Is Loading...</div>
      : (
        <div className="container-fluid">
          <div className="row d-flex justify-content-center">
            <div className="col-10">
              <div className="card p-3">
                <div
                  className="text-muted bg-white"
                  style={backToCatalogButtonStyle}
                  onClick={() => this.props.setView('catalog', {})}>
                  {'<'} Back to Catalog
                </div>
                <div className="details-top mb-5">
                  <div className="container">
                    <div className="row">
                      <img
                        src={this.state.product.image}
                        className="col-6"
                        style={imageStyle}
                        alt="Busted" />
                      <div className="col-6">
                        <h3 className="mb-3">{this.state.product.name}</h3>
                        <h5 className="mb-3 text-muted">{'$' + (this.state.product.price / 100).toFixed(2)}</h5>
                        <p>{this.state.product.shortDescription}.</p>
                        <button onClick={() => this.props.addToCart(this.state.product)} type="button" className="btn btn-primary">Add to Cart</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="details-bottom">
                  <p>{this.state.product.longDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
  }
}
