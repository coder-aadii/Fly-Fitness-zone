import React, { Component } from 'react';
import NotFound from '../pages/NotFound';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // You could also log to a service like Sentry here
  }

  render() {
    if (this.state.hasError) {
      // Use our enhanced NotFound component with server error type
      return <NotFound type="server" />;
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;