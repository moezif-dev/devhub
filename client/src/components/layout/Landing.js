import React, {Component} from "react";
import { Button, Container } from 'semantic-ui-react';

import "./css/landing.scss";

class Landing extends Component {
	render() {
		return (
			<div className="landing">
				<div className="landing-inner dark-overlay">
					<Container textAlign='center'>
						<h1 className="landing-header text-white">Hello world!</h1>
						<p className="landing-subheader text-white block-center"><span className="title text-bold">DevHub </span>
							is a social network where developers create profile/portfolio, share posts, and get help from other developers
						</p>
						<Button primary size="big">Sign-up</Button>
    				<Button secondary size="big">Login</Button>
					</Container>
			  </div>
      </div>
		)
	}
}

export default Landing;