import React from 'react';
import {Container} from 'semantic-ui-react';

import './css/footer.scss';

export default () => {
	return <footer id="page-footer" className="text-white bg-black"><Container textAlign='center'>Copyright &copy; {new Date().getFullYear()} DevHub</Container></footer>
}