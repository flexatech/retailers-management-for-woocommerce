import { Plus, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { __ } from '@wordpress/i18n';

export default function EmptyRetailersGrid() {
  const navigate = useNavigate();
  return (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="p-12 text-center">
        <Tag className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
        <h3 className="mb-2 text-lg font-semibold">{__('No retailers found', 'retailers-management-for-woocommerce')}</h3>
        <p className="text-muted-foreground mb-4">
          {__('Try adjusting your search or create a new retailer', 'retailers-management-for-woocommerce')}
        </p>
        <Button onClick={() => navigate('/retailers/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          {__('Add Retailer', 'retailers-management-for-woocommerce')}
        </Button>
      </CardContent>
    </Card>
  );
}
