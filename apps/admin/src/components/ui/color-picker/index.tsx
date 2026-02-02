import './color-picker.css';

import { useRef, useState } from 'react';
import { ArrowCounterClockwiseIcon, CheckIcon } from '@phosphor-icons/react';
import {
  ColorPalette,
  __experimentalInputControl as InputControl,
  Button as WPButton,
  ColorPicker as WPColorPicker,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { RefreshCcw } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ColorPickerProps {
  value?: string;
  defaultColor?: string;
  onChangeColor?: (color: string) => void;
  className?: string;
  disabled?: boolean;
}

export function ColorPicker({
  value,
  defaultColor = '#ffffff',
  onChangeColor,
  className,
  disabled = false,
}: ColorPickerProps) {
  const colors = [
    { name: 'Black', color: '#181818' },
    { name: 'White', color: '#F5F5F5' },
    { name: 'Red', color: '#E7210A' },
    { name: 'Orange', color: '#F54A00' },
    { name: 'Green', color: '#5EA500' },
    { name: 'Blue', color: '#165CFB' },
    { name: 'Yellow', color: '#FDC700' },
    { name: 'Purple', color: '#8F00FF' },
    { name: 'Pink', color: '#FF5FA2' },
    { name: 'Teal', color: '#00BFAE' },
  ];

  const displayColor = value || defaultColor;
  const initialDefaultColor = useRef(defaultColor);
  const inputValue = displayColor.replace(/^#/, '').slice(0, 6);

  const handleOpenAutoFocus = (event: Event) => {
    // Check if displayColor matches any of the predefined palette colors
    const isColorInPalette = colors.some((color) => color.color === displayColor);

    if (isColorInPalette) {
      // Prevent default focus behavior only if we want to focus a palette color
      event.preventDefault();

      // Use setTimeout to ensure the DOM is fully rendered
      setTimeout(() => {
        // find the selected color button
        const selected = document.querySelector<HTMLButtonElement>(
          '.components-circular-option-picker__option[aria-checked="true"]',
        );
        if (selected) {
          selected.focus();
        }
      }, 0);
    }
    // If displayColor is not in palette, let Radix handle default focus behavior
  };

  const handleChange = (newColor?: string) => {
    if (!newColor) return;
    const normalized = newColor.startsWith('#') ? newColor : `#${newColor}`;
    const trimmed = normalized.replace(/^#/, '').slice(0, 6);
    const finalColor = `#${trimmed}`;
    onChangeColor?.(finalColor);
  };

  const handleInputChange = (nextValue?: string) => {
    const raw = nextValue ?? '';
    const truncated = raw.slice(0, 6);
    const candidate = `#${truncated}`;
    const isValidHex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(candidate);

    if (isValidHex) {
      onChangeColor?.(candidate);
    } else {
      onChangeColor?.('#000000');
    }
  };

  const handleClear = () => {
    const reset = initialDefaultColor.current;
    onChangeColor?.(reset);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="primary-outline"
          disabled={disabled}
          className={cn(
            'h-8.5 w-[110px] cursor-pointer justify-start rounded-sm p-1',
            'border-border text-foreground',
            'hover:border-primary hover:text-primary',
            className,
          )}
        >
          <span
            className="h-6.5 w-6.5 rounded-[4px] border"
            style={{ backgroundColor: displayColor }}
          />
          <span className="text-start font-normal">{displayColor}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-fit min-w-[200px] px-1 py-3"
        align="start"
        sideOffset={5}
        onOpenAutoFocus={handleOpenAutoFocus}
      >
        <div className="flex flex-col gap-2">
          <div className="px-2">
            <ColorPalette
              colors={colors}
              value={displayColor}
              onChange={(newColor = '#000000') => handleChange(newColor)}
              disableCustomColors={true}
              clearable={false}
              className="flexa-wp-color-palette"
            />
          </div>

          <WPColorPicker
            className="flexa-wp-color-picker"
            color={displayColor}
            onChange={handleChange}
            enableAlpha={false}
            defaultValue={defaultColor}
            copyFormat="hex"
          />

          <div className="flex items-center justify-between gap-3 px-3">
            <div className="flex items-center gap-2">
              <InputControl
                __next40pxDefaultSize
                prefix={<span className="ml-3">#</span>}
                value={inputValue}
                onChange={handleInputChange}
                className="flexa-wp-color-input w-full"
              />
            </div>
            <Button
              className={cn('border-border text-foreground w-fit cursor-pointer')}
              variant="primary-outline"
              type="button"
              onClick={handleClear}
            >
              <RefreshCcw className="size-4" /> {__('Reset')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
