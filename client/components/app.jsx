import React from 'react';
import Header from './header';
import ProductList from './product-list';
import ProductDetails from './product-details';
import CartSummary from './cart-summary';
import CheckoutForm from './checkout-form';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: {
        name: 'catalog',
        params: {}
      },
      cart: []
    };
  }

  setView = (name, params) => {
    this.setState({
      view: {
        name,
        params
      }
    });
  }

  getCartItems = () => {
    fetch('/api/cart')
      .then(res => res.json())
      .then(cart => {
        this.setState({
          cart
        });
      });
  }

  addToCart = product => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const fetchConfig = {
      method: 'POST',
      headers,
      body: JSON.stringify(product)
    };
    fetch('/api/cart', fetchConfig)
      .then(res => res.json())
      .then(newCartItem => {
        const cart = [...this.state.cart];
        cart.push(newCartItem);
        this.setState({
          cart
        });
      });
  }

  placeOrder = ({ name, creditCard, shippingAddress }) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const fetchConfig = {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name,
        creditCard,
        shippingAddress
      })
    };
    fetch('api/orders', fetchConfig)
      .then(res => {
        this.setState({
          cart: []
        });
        this.setView('catalog', {});
      });
  }

  componentDidMount = () => {
    this.getCartItems();
  }

  render = () => {
    const mainContainerStyle = {
      width: '100vw',
      height: '100vh',
      overflow: 'auto'
    };
    let currentView = null;
    if (this.state.view.name === 'catalog') {
      currentView = <ProductList setView={this.setView} />;
    } else if (this.state.view.name === 'details') {
      currentView = <ProductDetails setView={this.setView} viewParams={this.state.view.params} addToCart={this.addToCart} />;
    } else if (this.state.view.name === 'cart') {
      currentView = <CartSummary setView={this.setView} cartItems={this.state.cart} />;
    } else if (this.state.view.name === 'checkout') {
      currentView = <CheckoutForm setView={this.setView} cartItems={this.state.cart} placeOrder={this.placeOrder} />;
    }
    return (
      <div className="bg-light" style={mainContainerStyle}>
        <Header setView={this.setView} cartItemCount={this.state.cart.length} />
        { currentView }
      </div>
    );
  }
}
