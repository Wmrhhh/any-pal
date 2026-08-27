import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("应用发生错误：", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>应用出现错误，请刷新页面后重试。</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;