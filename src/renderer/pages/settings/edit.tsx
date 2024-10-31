import { Suspense } from 'react';
import { Await, useRouteLoaderData } from 'react-router-typesafe';
import SettingsForm from './form';
import { rootLoader } from '../../layouts/dashboard';
import Loading from '../../components/Loading';

export default function SettingsEditPage() {
  const { settingsPromise } = useRouteLoaderData<typeof rootLoader>('root');

  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={settingsPromise}>
        {(settings) => <SettingsForm settings={settings} method="PUT" />}
      </Await>
    </Suspense>
  );
}
