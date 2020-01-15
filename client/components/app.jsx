import React from 'react';
import Header from './header';
import ProductList from './product-list';
import ProductDetails from './product-details';

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

  componentDidMount = () => {
    this.getCartItems();
  }

  render = () => {
    const mainContainerStyle = {
      width: '100vw',
      height: '100vh'
    };
    return (
      <div className="bg-light" style={mainContainerStyle}>
        <Header cartItemCount={this.state.cart.length} />
        {
          this.state.view.name === 'catalog'
            ? <ProductList setView={this.setView} />
            : <ProductDetails setView={this.setView} viewParams={this.state.view.params} addToCart={this.addToCart} />
        }
      </div>
    );
  }
}
