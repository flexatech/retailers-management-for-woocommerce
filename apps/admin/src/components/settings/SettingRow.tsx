import { Info } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  tooltip?: string;
  disabled?: boolean;
}

export const SettingRow = ({
  icon,
  title,
  description,
  checked,
  onCheckedChange,
  tooltip,
  disabled,
}: SettingRowProps) => (
  <div className="hover:bg-muted/50 relative flex items-center justify-between p-5 transition-colors">
    <div className="flex items-start gap-4">
      <div className="bg-muted text-muted-foreground rounded-lg p-2.5">{icon}</div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Label className="text-foreground cursor-pointer font-medium">{title}</Label>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger>
                <Info className="text-muted-foreground h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
    <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
  </div>
);
