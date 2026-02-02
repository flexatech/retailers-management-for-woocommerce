import { useEffect, useRef, useState } from 'react';
import { Spinner } from '@wordpress/components';
import { MapPin } from 'lucide-react';
import { useDebounce } from 'react-use';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { __ } from '@wordpress/i18n';

interface AddressResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface Props {
  value?: string;
  error?: boolean;
  onSelect: (data: { address: string; lat: string; lng: string }) => void;
  onClear?: () => void;
}

export function AddressAutocomplete({ value = '', error = false, onSelect, onClear }: Props) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<AddressResult[]>([]);
  const [loading, setLoading] = useState(false);

  const suppressSearchRef = useRef(false);

  useEffect(() => {
    suppressSearchRef.current = true;
    setQuery(value);
  }, [value]);

  useDebounce(
    async () => {
      if (suppressSearchRef.current) {
        suppressSearchRef.current = false;
        return;
      }

      if (!query || query.length < 3) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
          {
            headers: {
              'User-Agent': 'Retailers-Management-for-WooCommerce/1.0.0 (WordPress Plugin; https://flexa.vn/)',
            },
          },
        );
        const data = await res.json();
        setResults(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    1000,
    [query],
  );

  return (
    <div className={cn('relative')}>
      <Input
        className={cn('rounded-md', error && 'border-destructive')}
        value={query}
        placeholder={__('Enter full address...', 'retailers-management-for-woocommerce')}
        onChange={(e) => {
          const val = e.target.value;

          suppressSearchRef.current = false;
          setQuery(val);

          if (!val) {
            setResults([]);
            onClear?.();
          }
        }}
        onFocus={() => {
          setResults([]);
        }}
      />

      {loading && (
        <div className="text-muted-foreground pointer-events-none absolute top-1/2 right-1 -translate-y-1/2 text-xs">
          <Spinner className="text-muted-foreground size-4 animate-spin" />
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border bg-white shadow-lg">
          <ul className="max-h-64 divide-y overflow-auto">
            {results.map((item) => (
              <li key={`${item.lat}-${item.lon}`}>
                <button
                  type="button"
                  className="hover:bg-muted flex w-full items-start gap-3 px-3 py-2 text-left transition"
                  onClick={() => {
                    suppressSearchRef.current = true;
                    setResults([]);

                    onSelect({
                      address: item.display_name,
                      lat: item.lat,
                      lng: item.lon,
                    });
                  }}
                >
                  <MapPin className="text-muted-foreground mt-1 h-4 w-4 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{item.display_name}</span>
                    <span className="text-muted-foreground text-xs">
                      {Number(item.lat).toFixed(5)}, {Number(item.lon).toFixed(5)}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
