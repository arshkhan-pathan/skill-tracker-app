'use client';

import * as React from 'react';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const variants = [
  { value: 'variant-1', label: 'Midnight Blue', color: 'bg-[oklch(0.62_0.22_270)]' },
  { value: 'variant-2', label: 'Forest Green', color: 'bg-[oklch(0.68_0.18_155)]' },
  { value: 'variant-3', label: 'Sunset Orange', color: 'bg-[oklch(0.70_0.20_45)]' },
  { value: 'variant-4', label: 'Rose Pink', color: 'bg-[oklch(0.66_0.22_340)]' },
  { value: 'variant-5', label: 'Slate Gray', color: 'bg-[oklch(0.65_0.15_220)]' },
];

export function ThemeVariantSwitcher() {
  const [mounted, setMounted] = React.useState(false);
  const [variant, setVariant] = React.useState<string>('variant-1');

  const updateDocumentVariant = React.useCallback((newVariant: string) => {
    const html = document.documentElement;
    // Remove all variant classes
    variants.forEach(v => html.classList.remove(v.value));
    // Add new variant class
    html.classList.add(newVariant);
  }, []);

  React.useEffect(() => {
    // Use a microtask to avoid synchronous setState
    Promise.resolve().then(() => {
      setMounted(true);
      const savedVariant = localStorage.getItem('theme-variant') || 'variant-5';
      setVariant(savedVariant);
      updateDocumentVariant(savedVariant);
    });
  }, [updateDocumentVariant]);

  const handleVariantChange = (newVariant: string) => {
    setVariant(newVariant);
    localStorage.setItem('theme-variant', newVariant);
    updateDocumentVariant(newVariant);
  };

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle theme variant</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Dark Mode Variants</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {variants.map((v) => (
          <DropdownMenuItem
            key={v.value}
            onClick={() => handleVariantChange(v.value)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2 w-full">
              <div className={`h-4 w-4 rounded-full ${v.color} ring-2 ring-offset-2 ring-offset-background ${variant === v.value ? 'ring-primary' : 'ring-transparent'}`} />
              <span className="flex-1">{v.label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
