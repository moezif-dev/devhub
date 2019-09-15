import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react'

import './css/navbar.scss';

class Navbar extends Component{
	state = { activeItem: 'home' }

	handleItemClick = (e, {name}) => this.setState({ activeItem: name });

	render(){
		const { activeItem } = this.state

		return (
      <Menu id="menu-navbar" className="dark-menu" pointing secondary>
        <Menu.Item header>DevHub</Menu.Item>
        <Menu.Item
          name='developers'
          active={activeItem === 'developers'}
          onClick={this.handleItemClick}
        />
        <Menu.Menu position='right'>
          <Menu.Item
            name='sign-up'
            active={activeItem === 'sign-up'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name='login'
            active={activeItem === 'login'}
            onClick={this.handleItemClick}
          />
        </Menu.Menu>
      </Menu>
		  );
	}
}

export default Navbar;