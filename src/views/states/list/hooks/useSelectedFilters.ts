import { useMemo } from 'react';

import useQueryParams from '@utils/hooks/useQueryParams';

import { FILTER_TYPES } from '../constants';

export type SelectedFilters = {
  [filter in typeof FILTER_TYPES as string]: string[];
};

const useSelectedFilters = (): SelectedFilters => {
  const queryParams = useQueryParams();

  return useMemo(
    () =>
      Object.keys(queryParams)
        .filter(
          (queryKey) =>
            queryKey.startsWith('rowFilter-') ||
            (Object.values(FILTER_TYPES) as string[]).includes(queryKey),
        )
        .reduce((acc, queryKey) => {
          const filterType = queryKey.replace('rowFilter-', '');
          const filterValue = queryParams[queryKey].split(',');
          acc[filterType] = filterValue;
          return acc;
        }, {} as SelectedFilters),
    [queryParams],
  );
};

export default useSelectedFilters;
