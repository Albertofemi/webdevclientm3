import { friendlyError } from '../utils.js';

// Renders the loading / error / empty feedback for a request.
export default function Status({ status, error, isEmpty, emptyMessage, onRetry }) {
  if (status === 'loading' || status === 'idle') {
    return (
      <p id="status" className="is-loading" role="status" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        Fetching meals…
      </p>
    );
  }
  if (status === 'error') {
    return (
      <p id="status" className="is-error" role="status" aria-live="polite">
        {friendlyError(error)}{' '}
        <button type="button" onClick={onRetry}>Try again</button>
      </p>
    );
  }
  return (
    <p id="status" role="status" aria-live="polite">
      {isEmpty ? emptyMessage : ''}
    </p>
  );
}
