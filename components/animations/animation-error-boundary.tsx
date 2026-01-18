"use client";

import { Component, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class AnimationErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error("[AnimationErrorBoundary] Animation error caught:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || this.props.children;
        }

        return this.props.children;
    }
}
