import { HandlerPayload, IpcChannels } from '../../shared/types/ipc';

const electronBaseQuery = async <T extends IpcChannels>({
  channel,
  payload,
}: {
  channel: T;
  payload?: HandlerPayload<T>;
}) => {
  try {
    const result = await window.electron.ipcRenderer.invoke(channel, payload);
    return { data: result };
  } catch (error) {
    return { error: { status: 'CUSTOM_ERROR', data: error } };
  }
};

export default electronBaseQuery;
