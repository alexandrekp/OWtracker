import {
  Component,
  type ErrorInfo,
  type ReactNode,
} from "react";

import {
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

import "./FeedbackStates.css";

type Props = {
  children:
    ReactNode;
};

type State = {
  hasError:
    boolean;

  message:
    string | null;
};

class AppErrorBoundary extends Component<
  Props,
  State
> {
  state: State = {
    hasError: false,
    message: null,
  };

  static getDerivedStateFromError(
    error: Error,
  ): State {
    return {
      hasError: true,
      message:
        error.message,
    };
  }

  componentDidCatch(
    error: Error,
    info: ErrorInfo,
  ) {
    console.error(
      "OWTracker render error:",
      error,
      info,
    );
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      message: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (
      !this.state
        .hasError
    ) {
      return this.props
        .children;
    }

    return (
      <div className="app-fatal-error">
        <div className="app-fatal-error-card">
          <div className="ui-state-icon error">
            <AlertTriangle
              size={22}
            />
          </div>

          <span className="panel-eyebrow">
            APPLICATION ERROR
          </span>

          <h1>
            Something went wrong
          </h1>

          <p>
            OWTracker encountered
            an unexpected interface
            error.
          </p>

          {this.state
            .message && (
            <code className="app-error-message">
              {
                this.state
                  .message
              }
            </code>
          )}

          <div className="app-error-actions">
            <button
              className="ui-state-button"
              onClick={
                this.handleRetry
              }
            >
              Try again
            </button>

            <button
              className="ui-state-button secondary"
              onClick={
                this.handleReload
              }
            >
              <RotateCcw
                size={13}
              />

              Reload app
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default AppErrorBoundary;