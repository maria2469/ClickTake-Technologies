import { useEffect, useRef } from "react";

declare global {
    interface Window {
        turnstile?: {
            render: (
                container: HTMLElement,
                options: {
                    sitekey: string;
                    callback: (token: string) => void;
                    "expired-callback"?: () => void;
                    "error-callback"?: () => void;
                    theme?: "light" | "dark" | "auto";
                }
            ) => string;
            reset: (widgetId?: string) => void;
            remove: (widgetId?: string) => void;
        };
    }
}

interface TurnstileWidgetProps {
    onVerify: (token: string) => void;
    onExpire?: () => void;
    resetTrigger?: number; // increment this from the parent to force a reset
}

const SCRIPT_ID = "cf-turnstile-script";

export function TurnstileWidget({ onVerify, onExpire, resetTrigger }: TurnstileWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    useEffect(() => {
        function renderWidget() {
            if (!containerRef.current || !window.turnstile) return;
            widgetIdRef.current = window.turnstile.render(containerRef.current, {
                sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
                theme: "dark",
                callback: (token) => onVerify(token),
                "expired-callback": () => onExpire?.(),
            });
        }

        if (window.turnstile) {
            renderWidget();
        } else if (!document.getElementById(SCRIPT_ID)) {
            const script = document.createElement("script");
            script.id = SCRIPT_ID;
            script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
            script.async = true;
            script.defer = true;
            script.onload = renderWidget;
            document.body.appendChild(script);
        } else {
            // Script tag exists but turnstile object not ready yet — poll briefly
            const interval = setInterval(() => {
                if (window.turnstile) {
                    clearInterval(interval);
                    renderWidget();
                }
            }, 100);
            return () => clearInterval(interval);
        }

        return () => {
            if (widgetIdRef.current && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reset widget when parent bumps resetTrigger (e.g. after a failed submit)
    useEffect(() => {
        if (resetTrigger && widgetIdRef.current && window.turnstile) {
            window.turnstile.reset(widgetIdRef.current);
        }
    }, [resetTrigger]);

    return <div ref={containerRef} />;
}