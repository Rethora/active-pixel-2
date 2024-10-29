import SettingsForm from './form';
import { Settings } from '../../../shared/types/settings';
import TransitionsModal from '../../components/TransitionsModal';

type SettingsEditPageProps = {
  settings: Settings;
  open: boolean;
  onClose: () => void;
};

export default function SettingsEditPage({
  settings,
  open,
  onClose,
}: SettingsEditPageProps) {
  return (
    <TransitionsModal open={open} onClose={onClose} title="Edit Settings">
      <SettingsForm settings={settings} method="PUT" />
    </TransitionsModal>
  );
}
