import {Component} from 'react';
import { withRouter } from 'next/router';


class ScrollToTop extends Component {
    componentDidUpdate(prevProps) {

        if (this.props.router.asPath !== prevProps.router.asPath) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return this.props.children;
    }
}

export default withRouter(ScrollToTop);

