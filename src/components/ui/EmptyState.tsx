import type {
  ReactNode,
} from "react";

import "./FeedbackStates.css";

type EmptyStateProps = {
  icon?:
    ReactNode;

  eyebrow?:
    string;

  title:
    string;

  description:
    string;

  actionLabel?:
    string;

  onAction?:
    () => void;
};

function EmptyState({
  icon,
  eyebrow = "EMPTY",
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <section className="ui-empty-state">
      {icon && (
        <div className="ui-state-icon">
          {icon}
        </div>
      )}

      <span className="panel-eyebrow">
        {eyebrow}
      </span>

      <h2>
        {title}
      </h2>

      <p>
        {description}
      </p>

      {actionLabel &&
        onAction && (
        <button
          className="ui-state-button"
          type="button"
          onClick={
            onAction
          }
        >
          {actionLabel}
        </button>
      )}
    </section>
  );
}

export default EmptyState;