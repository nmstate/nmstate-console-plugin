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
} from '@openshift-console/dynamic-plugin-sdk';
import { Pagination } from '@patternfly/react-core';
import { Table, TableGridBreakpoint, TableHeader } from '@patternfly/react-table';
import { V1beta1NodeNetworkState } from '@types';
import usePagination from '@utils/hooks/usePagination/usePagination';
import { paginationDefaultValues } from '@utils/hooks/usePagination/utils/constants';

import InterfaceDrawer from './components/InterfaceDrawer/InterfaceDrawer';
import NNStateEmptyState from './components/NNStateEmptyState';
import StateRow from './components/StateRow';
import StatusBox from './components/StatusBox';
import useDrawerInterface from './hooks/useDrawerInterface';
import useSelectedFilters from './hooks/useSelectedFilters';
import useStateColumns from './hooks/useStateColumns';
import useStateFilters from './hooks/useStateFilters';
import { FILTER_TYPES } from './constants';

const StatesList: FC = () => {
  const { t } = useNMStateTranslation();
  const { selectedInterfaceName, selectedStateName, selectedInterfaceType } = useDrawerInterface();

  const [states, statesLoaded, statesError] = useK8sWatchResource<V1beta1NodeNetworkState[]>({
    groupVersionKind: NodeNetworkStateModelGroupVersionKind,
    isList: true,
    namespaced: false,
  });

  const selectedState = states?.find((state) => state.metadata.name === selectedStateName);
  const selectedInterface = selectedState?.status?.currentState?.interfaces?.find(
    (iface) => iface.name === selectedInterfaceName && iface.type === selectedInterfaceType,
  );

  const { onPaginationChange, pagination } = usePagination();
  const [columns, activeColumns] = useStateColumns();
  const filters = useStateFilters();
  const selectedFilters = useSelectedFilters();
  const [data, filteredData, onFilterChange] = useListPageFilter(states, filters);

  const paginatedData = filteredData.slice(pagination?.startIndex, pagination?.endIndex + 1);

  return (
    <>
      <ListPageHeader title={t(NodeNetworkStateModel.label)}></ListPageHeader>
      <ListPageBody>
        <StatusBox loaded={statesLoaded} error={statesError}>
          <div className="list-managment-group">
            <ListPageFilter
              data={data}
              loaded={statesLoaded}
              rowFilters={filters.filter((filter) => filter?.type !== FILTER_TYPES.IP_ADDRESS)}
              hideLabelFilter
              nameFilterTitle={t('IP address')}
              nameFilterPlaceholder={t('Search by IP address...')}
              nameFilter={FILTER_TYPES.IP_ADDRESS}
              onFilterChange={(...args) => {
                onFilterChange(...args);
                onPaginationChange({
                  endIndex: pagination?.perPage,
                  page: 1,
                  perPage: pagination?.perPage,
                  startIndex: 0,
                });
              }}
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
            <Pagination
              onPerPageSelect={(_e, perPage, page, startIndex, endIndex) =>
                onPaginationChange({ endIndex, page, perPage, startIndex })
              }
              onSetPage={(_e, page, perPage, startIndex, endIndex) =>
                onPaginationChange({ endIndex, page, perPage, startIndex })
              }
              className="list-managment-group__pagination"
              defaultToFullPage
              itemCount={filteredData?.length}
              page={pagination?.page}
              perPage={pagination?.perPage}
              perPageOptions={paginationDefaultValues}
            />
          </div>

          {filteredData.length > 0 ? (
            <Table
              cells={activeColumns}
              rows={paginatedData}
              gridBreakPoint={TableGridBreakpoint.none}
              role="presentation"
            >
              <TableHeader />
              {paginatedData.map((nnstate, index) => (
                <StateRow
                  key={nnstate?.metadata?.name}
                  obj={nnstate}
                  activeColumnIDs={new Set(activeColumns.map(({ id }) => id))}
                  rowData={{ rowIndex: index, selectedFilters }}
                />
              ))}
            </Table>
          ) : (
            <NNStateEmptyState />
          )}
        </StatusBox>
      </ListPageBody>
      <InterfaceDrawer selectedInterface={selectedInterface} />
    </>
  );
};

export default StatesList;
