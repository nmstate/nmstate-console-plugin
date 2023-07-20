import { useMemo } from 'react';

import useQueryParams from '@utils/hooks/useQueryParams';

import { FILTERS_TYPES } from '../constants';

export type SelectedFilters = {
  [filter in typeof FILTERS_TYPES as string]: string[];
};

const useSelectedFilters = (): SelectedFilters => {
  const queryParams = useQueryParams();

  return useMemo(
    () =>
      Object.keys(queryParams)
        .filter((queryKey) => queryKey.startsWith('rowFilter-'))
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
