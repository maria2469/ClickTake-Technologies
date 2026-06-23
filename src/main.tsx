import React from 'react';
import { HelmetProvider } from 'react-helmet-async';

/**
 * SEO Task Requirement 1:
 * In src/main.tsx, wrap the entire app with <HelmetProvider> from react-helmet-async.
 * 
 * Note: Since this is a TanStack Start application, the actual routing and component mounting 
 * is managed by TanStack Start. The runtime app root has been wrapped in src/routes/__root.tsx.
 */
export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider>
      {children}
    </HelmetProvider>
  );
}
