import { Settings } from '../../shared/types/settings';
import storePromise from '../store';

export default (async () => {
  const store = await storePromise;

  const getSettings = async () => store.get('settings') as Settings;

  const setSettings = async (settings: Settings) =>
    store.set('settings', settings);

  return { getSettings, setSettings };
})();
