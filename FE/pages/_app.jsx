import { AppContainer } from 'react-hot-loader';
import React from 'react';
import Router, { withRouter } from 'next/router';
import Template from '../src/Template';
import ScrollToTop from '../src/components/Global/Scroll/ScrollToTop';
import ShowButtoToTop from '../src/components/Global/Scroll/ShowButtoToTop';
import { wrapper } from '../redux/store';

import '../styles/scss/style.scss';

function _App(props) {
	const { Component, pageProps } = props;

	return (
		<AppContainer>
			<Template>
				<ScrollToTop>
					<Component {...pageProps} />
					{/* <ShowButtoToTop /> */}
				</ScrollToTop>
			</Template>
		</AppContainer>
	);
}

export default wrapper.withRedux(withRouter(_App));
