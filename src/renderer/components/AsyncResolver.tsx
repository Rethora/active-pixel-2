import { ReactNode, Suspense } from 'react';
import { Await } from 'react-router-typesafe';

interface AsyncResolverProps<T> {
  promises: { [K in keyof T]: Promise<T[K]> };
  fallback?: ReactNode;
  errorElement?: ReactNode;
  children: (resolved: T) => ReactNode;
}

export default function AsyncResolver<T extends Record<string, unknown>>({
  promises,
  fallback,
  errorElement,
  children,
}: AsyncResolverProps<T>) {
  return (
    <Suspense fallback={fallback}>
      <Await resolve={promises} errorElement={errorElement}>
        {(resolved) => {
          return children(resolved as unknown as T);
        }}
      </Await>
    </Suspense>
  );
}
