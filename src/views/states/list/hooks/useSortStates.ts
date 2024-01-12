import { MouseEvent, useState } from 'react';

import { SortByDirection } from '@patternfly/react-table';
import { ThSortType } from '@patternfly/react-table/dist/esm/components/Table/base';
import { V1beta1NodeNetworkState } from '@types';

const useSortStates = (
  nodeNetworkStates: V1beta1NodeNetworkState[],
): { sortedStates: V1beta1NodeNetworkState[]; nameSortParams: ThSortType } => {
  const [activeSortIndex, setActiveSortIndex] = useState<number | null>(null);
  const [activeSortDirection, setActiveSortDirection] = useState<'asc' | 'desc' | null>(null);

  let sortedStates = nodeNetworkStates;
  if (activeSortIndex === 1) {
    sortedStates = nodeNetworkStates.sort((a, b) => {
      const aValue = a.metadata.name as string;
      const bValue = b.metadata.name as string;

      if (activeSortDirection === 'asc') {
        return (aValue as string).localeCompare(bValue);
      }
      return (bValue as string).localeCompare(aValue);
    });
  }

  const nameSortParams: ThSortType = {
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
    },
    onSort: (_event: MouseEvent, index: number, direction: SortByDirection) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex: 1,
  };

  return { sortedStates, nameSortParams };
};

export default useSortStates;
