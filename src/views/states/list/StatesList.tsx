import React, { FC } from 'react';
import {
  NodeNetworkStateModelGroupVersionKind,
  NodeNetworkStateModelRef,
} from 'src/console-models';
import NodeNetworkStateModel from 'src/console-models/NodeNetworkStateModel';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import {
  ListPageBody,
  ListPageFilter,
  ListPageHeader,
  useK8sWatchResource,
  useListPageFilter,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import { V1beta1NodeNetworkState } from '@types';

import StateRow from './components/StateRow';
import useStateColumns from './hooks/useStateColumns';
import useStateFilters from './hooks/useStateFilters';

const StatesList: FC = () => {
  const { t } = useNMStateTranslation();

  const [states, statesLoaded, statesLoadError] = useK8sWatchResource<V1beta1NodeNetworkState[]>({
    groupVersionKind: NodeNetworkStateModelGroupVersionKind,
    isList: true,
    namespaced: false,
  });

  const [columns, activeColumns] = useStateColumns();
  const filters = useStateFilters();
  const [data, filteredData, onFilterChange] = useListPageFilter(states, filters);

  return (
    <>
      <ListPageHeader title={t(NodeNetworkStateModel.label)}></ListPageHeader>
      <ListPageBody>
        <ListPageFilter
          data={data}
          loaded={statesLoaded}
          rowFilters={filters}
          onFilterChange={onFilterChange}
          columnLayout={{
            columns: columns?.map(({ id, title, additional }) => ({
              id,
              title,
              additional,
            })),
            id: NodeNetworkStateModelRef,
            selectedColumns: new Set(activeColumns?.map((col) => col?.id)),
            type: t('NodeNetworkState'),
          }}
        />

        <VirtualizedTable<V1beta1NodeNetworkState>
          data={filteredData}
          unfilteredData={data}
          loaded={statesLoaded}
          columns={activeColumns}
          loadError={statesLoadError}
          Row={StateRow}
        />
      </ListPageBody>
    </>
  );
};

export default StatesList;
