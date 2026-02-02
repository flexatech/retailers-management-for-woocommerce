import { __ } from '@wordpress/i18n';

import { api, handleResponse } from '@/lib/api/base';
import { DEFAULT_SETTINGS } from '@/lib/helpers/settings.helper';
import { SettingsFormData } from '@/lib/schema/settings';

export async function fetchSettings() {
  const response = await api.get('settings');
  const result = await handleResponse<SettingsFormData>(response, __('Failed to fetch settings'));
  return result.data ?? window.retailersManagement.settings ?? DEFAULT_SETTINGS;
}

export async function postSettings(data: SettingsFormData) {
  const response = await api.post('settings', { json: data });
  const result = await handleResponse<SettingsFormData>(response, __('Failed to save settings'));
  return result.data;
}
