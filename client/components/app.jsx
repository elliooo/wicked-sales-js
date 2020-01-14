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
      }
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

  render = () => {
    return (
      <div className="bg-light">
        <Header />
        {
          this.state.view.name === 'catalog'
            ? <ProductList setView={this.setView} />
            : <ProductDetails setView={this.setView} viewParams={this.state.view.params} />
        }
      </div>
    );
  }
}
