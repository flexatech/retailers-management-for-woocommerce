import * as React from 'react';
import { __ } from '@wordpress/i18n';
import { Info } from 'lucide-react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { RetailersManagementToolTip } from '../custom/RetailersManagementToolTip';

interface BaseSwitchFieldProps {
  /** Icon displayed on the left */
  icon?: React.ReactNode;

  /** Main label */
  label: string;

  isCustomLabel?: boolean;

  customLabel?: React.ReactNode;

  /** Secondary description text */
  description?: React.ReactNode;

  /** Tooltip content */
  tooltip?: string;

  /** Disable interaction */
  disabled?: boolean;

  /** Custom wrapper class */
  className?: string;
}

interface ControlledSwitchFieldProps extends BaseSwitchFieldProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  name?: never;
  control?: never;
}

interface RHFSwitchFieldProps<T extends FieldValues> extends BaseSwitchFieldProps {
  name: Path<T>;
  control: Control<T>;
  checked?: never;
  onCheckedChange?: never;
}

type SwitchFieldProps<T extends FieldValues = FieldValues> =
  | ControlledSwitchFieldProps
  | RHFSwitchFieldProps<T>;

export function SwitchField<T extends FieldValues>(props: SwitchFieldProps<T>) {
  if ('control' in props) {
    const { name, control, ...rest } = props;

    return (
      <Controller
        name={name as Path<T>}
        control={control}
        render={({ field }) => (
          <SwitchFieldUI {...rest} checked={!!field.value} onCheckedChange={field.onChange} />
        )}
      />
    );
  }

  const { checked, onCheckedChange, ...rest } = props;

  return <SwitchFieldUI {...rest} checked={checked} onCheckedChange={onCheckedChange} />;
}

interface SwitchFieldUIProps extends BaseSwitchFieldProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function SwitchFieldUI({
  icon,
  label,
  isCustomLabel,
  customLabel,
  description,
  tooltip,
  checked,
  onCheckedChange,
  disabled,
  className,
}: SwitchFieldUIProps) {
  return (
    <div
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      className={cn(
        'flex items-center justify-between rounded-lg p-4 transition-colors',
        !disabled && 'hover:bg-muted/50 cursor-pointer',
        disabled && 'pointer-events-none opacity-60',
        className,
      )}
      onClick={() => onCheckedChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCheckedChange(!checked);
        }
      }}
    >
      {/* LEFT */}
      <div className="flex items-start gap-3">
        {icon}

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {isCustomLabel ? (
              customLabel
            ) : (
              <Label className="cursor-pointer font-medium">{label}</Label>
            )}

            {tooltip && (
              <RetailersManagementToolTip
                trigger={
                  <button type="button" onClick={(e) => e.stopPropagation()}>
                    <Info className="text-muted-foreground h-4 w-4" />
                  </button>
                }
                content={<p className="max-w-xs text-sm">{tooltip}</p>}
              />
            )}
          </div>

          {description}
        </div>
      </div>

      {/* RIGHT */}
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
