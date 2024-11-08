import { useGetSettingsQuery } from '../../slices/settingsSlice';
import SettingsForm from './form';
import { Settings } from '../../../shared/types/settings';

export default function SettingsEditPage() {
  const { data: settings = {} as Settings } = useGetSettingsQuery();

  return <SettingsForm settings={settings} />;
}
