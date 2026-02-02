import { useEffect, useState } from 'react';

import { useUpdateRetailerTypeStatusMutation } from '@/lib/queries/retailerTypes';
import { Switch } from '@/components/ui/switch';

export default function RetailerTypeStatusSwitch({
  size,
  id,
  status,
}: {
  size: 'sm' | 'md' | 'lg';
  id: number;
  status: boolean;
}) {
  const { mutate: updateStatus, isPending } = useUpdateRetailerTypeStatusMutation(id);

  const [checked, setChecked] = useState(status);

  useEffect(() => {
    setChecked(status);
  }, [status]);

  const onToggle = (value: boolean) => {
    setChecked(value);
    updateStatus(value);
  };

  return <Switch size={size} checked={checked} onCheckedChange={onToggle} disabled={isPending} />;
}
