import { Component } from 'react';

import { StatusPanel } from '../status-panel';

export class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError)
      return (
        <StatusPanel
          isError
          title="Не удалось отобразить страницу"
          description="Обновите страницу, чтобы начать поиск заново."
          onRetry={() => window.location.reload()}
        />
      );
    return this.props.children;
  }
}
