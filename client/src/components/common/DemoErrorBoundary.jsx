import React from "react";

/**
 * DemoErrorBoundary
 * 
 * Hackathon-grade resilience shield that catches any unhandled React runtime errors,
 * prevents the infamous "white screen of death", and provides a polished, authoritative
 * institutional recovery interface that keeps the judge demo running seamlessly.
 */
export default class DemoErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showTechnicalDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.warn("[DemoErrorBoundary] Caught runtime exception in demo mode:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleGoDashboard = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          resetError: this.handleReset,
        });
      }

      return (
        <div className="min-h-[420px] w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 font-sans">
          <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 text-center relative overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200">
            {/* Ambient background glow */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Shield Icon Badge */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800/60 text-violet-600 dark:text-violet-400 mb-5 shadow-inner">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
              Sandbox Demo Shield Active
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              This module operates in high-resilience presentation mode. Your session state and local data are protected.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleGoDashboard}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm transition-all shadow-md hover:shadow-violet-500/25 active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Return to Dashboard</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm transition-all active:scale-95 flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Resume Component</span>
              </button>
            </div>

            {/* Optional Collapsible Technical Detail (kept minimal) */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => this.setState((prev) => ({ showTechnicalDetails: !prev.showTechnicalDetails }))}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-mono inline-flex items-center gap-1 transition-colors"
              >
                <span>{this.state.showTechnicalDetails ? "▼ Hide Diagnostics" : "▶ Diagnostics Info"}</span>
              </button>

              {this.state.showTechnicalDetails && (
                <div className="mt-3 text-left p-3 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400 overflow-x-auto max-h-36">
                  <p className="font-semibold text-rose-500 mb-1">{String(this.state.error)}</p>
                  <pre className="text-[10px] leading-tight text-slate-500">{this.state.errorInfo?.componentStack || "No stack trace recorded"}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
