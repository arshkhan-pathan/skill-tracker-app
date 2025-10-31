'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  React.useEffect(() => {
    // Apply saved variant on mount
    const savedVariant = localStorage.getItem('theme-variant') || 'variant-5';
    document.documentElement.classList.add(savedVariant);
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
