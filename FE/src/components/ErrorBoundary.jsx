import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        console.log('ErrorBoundary===error:', error);
        console.log('ErrorBoundary===info:', info);
        this.setState({hasError: true});
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            console.log('Error==========', error);
            console.log('ErrorInfo==========', JSON.stringify(info));
        } else {
            // You can also log the error to an error reporting service
            //LogApi.logErrorToMyService(error, info);
        }
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary
