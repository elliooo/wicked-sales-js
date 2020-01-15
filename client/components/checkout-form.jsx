import React from 'react';

export default class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      creditCard: '',
      shippingAddress: ''
    };
  }

  handleSubmit = event => {
    this.props.placeOrder(this.state);
    event.preventDefault();
  }

  handleNameChange = event => {
    this.setState({ name: event.target.value });
  }

  handleCreditCardChange = event => {
    this.setState({ creditCard: event.target.value });
  }

  handleShippingAddressChange = event => {
    this.setState({ shippingAddress: event.target.value });
  }

  render = () => {
    const continueShoppingButtonStyle = {
      cursor: 'pointer'
    };

    const cartItemPrices = this.props.cartItems.map(cartItem => cartItem.price);
    const cartSubtotal = this.props.cartItems.length === 0 ? (0).toFixed(2) : +(cartItemPrices.reduce((subtotal, value) => subtotal + value) / 100).toFixed(2);

    return (
      <div className="container-fluid">
        <div className="row d-flex justify-content-center">
          <div className="col-10">
            <h1>My Cart</h1>
            <h3 className="text-muted">Subtotal: {'$' + cartSubtotal}</h3>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="name-input">Name</label>
                <input type="text" className="form-control" id="name-input" onChange={this.handleNameChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="credit-card-input">Credit Card</label>
                <input type="text" className="form-control" id="credit-card-input" onChange={this.handleCreditCardChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="shipping-address-input">Shipping Address</label>
                <textarea className="form-control" id="shipping-address-input" onChange={this.handleShippingAddressChange} rows="4" required />
              </div>
              <div className="container-fluid form-buttons-container">
                <div className="row d-flex justify-content-between">
                  <div
                    className="text-muted"
                    style={continueShoppingButtonStyle}
                    onClick={() => this.props.setView('catalog', {})}
                  >
                    {'<'} Continue Shopping
                  </div>
                  <button type="submit" className="btn btn-primary">Place Order</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
