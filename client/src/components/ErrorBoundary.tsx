import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-4 font-sans">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl max-w-2xl w-full border border-red-100 text-center">
                        <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong</h1>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            We encountered an unexpected error. It's not you, it's us. Please try reloading the page.
                        </p>

                        <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left overflow-auto max-h-48 border border-gray-200">
                            <code className="text-sm text-red-600 font-mono block mb-2">
                                {this.state.error && this.state.error.toString()}
                            </code>
                            <details className="text-xs text-gray-500 font-mono whitespace-pre-wrap">
                                <summary className="cursor-pointer hover:text-gray-700 mb-1">Stack Trace</summary>
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </details>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={this.handleReload}
                                className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors gap-2"
                            >
                                <RefreshCw className="w-5 h-5" /> Reload Page
                            </button>
                            <button
                                onClick={this.handleGoHome}
                                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 border-2 border-gray-200 font-bold rounded-xl hover:bg-gray-50 transition-colors gap-2"
                            >
                                <Home className="w-5 h-5" /> Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
