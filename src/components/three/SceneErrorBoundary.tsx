"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface SceneErrorBoundaryProps {
  children: ReactNode;
  /** Rendered instead of the canvas when WebGL or the model request fails. */
  fallback: ReactNode;
}

interface SceneErrorBoundaryState {
  failed: boolean;
}

/**
 * The 3D scene is decorative, so a failed WebGL context (or a blocked/failed
 * model request) must degrade to a placeholder instead of taking the hero down
 * with it — which is what happens today with a bare <Canvas>.
 */
export default class SceneErrorBoundary extends Component<
  SceneErrorBoundaryProps,
  SceneErrorBoundaryState
> {
  state: SceneErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("[3D scene] disabled:", error.message, info.componentStack);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
