import "./FeedbackStates.css";

function AppLoader() {
  return (
    <div className="app-loader">
      <div className="app-loader-content">
        <div className="app-loader-brand">
          <div className="app-loader-mark">
            OW
          </div>

          <div>
            <span>
              OVERWATCH COMPANION
            </span>

            <strong>
              OWTRACKER
            </strong>
          </div>
        </div>

        <div className="app-loader-progress">
          <span />
        </div>

        <div className="app-loader-footer">
          <span>
            Loading companion
          </span>

          <div className="app-loader-dots">
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppLoader;