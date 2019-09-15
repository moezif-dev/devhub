import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import './App.scss';

import {Footer, Landing, Navbar} from './components/layout';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <Landing />
        <Footer />
      </div>
    );
  }
}

export default App;
