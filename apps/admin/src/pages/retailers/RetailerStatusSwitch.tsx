import { useEffect, useState } from 'react';

import { useUpdateRetailerStatusMutation } from '@/lib/queries/retailers';
import { Switch } from '@/components/ui/switch';

export default function RetailerStatusSwitch({
  size,
  id,
  status,
}: {
  size: 'sm' | 'md' | 'lg';
  id: number;
  status: boolean;
}) {
  const { mutate: updateStatus, isPending } = useUpdateRetailerStatusMutation(id);

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
