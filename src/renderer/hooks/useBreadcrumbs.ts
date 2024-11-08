import { useLocation, useParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export interface Breadcrumb {
  path: string;
  title: string;
}

interface BreadcrumbOverrides {
  [key: string]: {
    title?: string | ((params: Record<string, string>) => string);
    path?: string;
    hide?: boolean;
    pageTitle?: string | ((params: Record<string, string>) => string);
  };
}

interface UseBreadcrumbsProps {
  overrides?: BreadcrumbOverrides;
  defaultPath?: string;
  defaultPageTitle?: string;
}

interface UseBreadcrumbsReturn {
  breadcrumbs: Breadcrumb[];
  pageTitle: string;
}

const useBreadcrumbs = ({
  overrides = {},
  defaultPath,
  defaultPageTitle = 'Dashboard',
}: UseBreadcrumbsProps = {}): UseBreadcrumbsReturn => {
  const { pathname } = useLocation();
  const params = useParams();

  const matchPathPattern = useCallback(
    (currentPath: string) => {
      // First try exact match
      if (overrides[currentPath]) {
        return overrides[currentPath];
      }

      // Then try matching patterns with parameters
      return Object.entries(overrides).find(([pattern]) => {
        if (!pattern.includes(':')) {
          return false;
        }

        const regexPattern = pattern.replace(
          /:([^/]+)/g,
          (_, paramName) => `${params[paramName] || '[^/]+'}`,
        );
        const regex = new RegExp(`^${regexPattern}$`);

        return regex.test(currentPath);
      })?.[1];
    },
    [overrides, params],
  );

  const generateBreadcrumb = useCallback(
    (segment: string, index: number, pathSegments: string[]) => {
      // Calculate the current path up to this segment
      const currentPath = `/${pathSegments.slice(0, index + 1).join('/')}`;

      // Check if this segment is a parameter value
      const isParamValue = Object.entries(params).some(
        ([, value]) => value === segment,
      );

      // Check for overrides for this path
      const override = matchPathPattern(currentPath);

      // If this segment should be hidden, skip it
      if (override?.hide) {
        return null;
      }

      // If this is a parameter value and no override exists, use the parameter key as title
      let title = segment;
      if (isParamValue) {
        const paramKey = Object.entries(params).find(
          ([, value]) => value === segment,
        )?.[0];
        title = paramKey
          ? paramKey.charAt(0).toUpperCase() + paramKey.slice(1)
          : segment;
      } else {
        title = segment.charAt(0).toUpperCase() + segment.slice(1);
      }

      // Apply overrides if they exist
      return {
        path:
          override?.path ||
          (defaultPath && index === pathSegments.length - 1
            ? defaultPath
            : currentPath),
        title:
          typeof override?.title === 'function'
            ? override.title(params as Record<string, string>)
            : override?.title || title,
      };
    },
    [params, matchPathPattern, defaultPath],
  );

  const { breadcrumbs, pageTitle } = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const crumbs = pathSegments
      .map((segment, index) => generateBreadcrumb(segment, index, pathSegments))
      .filter((crumb): crumb is Breadcrumb => crumb !== null);

    // Generate page title from the last valid breadcrumb or override
    const currentPathOverride = matchPathPattern(pathname);
    let title: string;

    if (currentPathOverride?.pageTitle) {
      title =
        typeof currentPathOverride.pageTitle === 'function'
          ? currentPathOverride.pageTitle(params as Record<string, string>)
          : currentPathOverride.pageTitle;
    } else {
      title = crumbs[crumbs.length - 1]?.title || defaultPageTitle;
    }

    return {
      breadcrumbs: crumbs,
      pageTitle: title,
    };
  }, [
    pathname,
    generateBreadcrumb,
    matchPathPattern,
    params,
    defaultPageTitle,
  ]);

  return { breadcrumbs, pageTitle };
};

export default useBreadcrumbs;
