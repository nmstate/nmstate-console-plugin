import React, { FC, useState } from 'react';
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
import { Button, Flex, Pagination } from '@patternfly/react-core';
import { Table, TableGridBreakpoint, Th, Thead, Tr } from '@patternfly/react-table';
import { V1beta1NodeNetworkState } from '@types';
import usePagination from '@utils/hooks/usePagination/usePagination';
import { paginationDefaultValues } from '@utils/hooks/usePagination/utils/constants';

import InterfaceDrawer from './components/InterfaceDrawer/InterfaceDrawer';
import NNStateEmptyState from './components/NNStateEmptyState';
import StateRow from './components/StateRow';
import StatusBox from './components/StatusBox';
import useDrawerInterface from './hooks/useDrawerInterface';
import useSelectedFilters from './hooks/useSelectedFilters';
import useSortStates from './hooks/useSortStates';
import useStateColumns, { COLUMN_NAME_ID } from './hooks/useStateColumns';
import { useStateFilters, useStateSearchFilters } from './hooks/useStateFilters';

import './states-list.scss';

const StatesList: FC = () => {
  const { t } = useNMStateTranslation();
  const { selectedInterfaceName, selectedStateName, selectedInterfaceType } = useDrawerInterface();

  const [expandAll, setExpandAll] = useState(false);

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
  const searchFilters = useStateSearchFilters();

  const selectedFilters = useSelectedFilters();
  const [data, filteredData, onFilterChange] = useListPageFilter(states, [
    ...filters,
    ...searchFilters,
  ]);

  const { sortedStates, nameSortParams } = useSortStates(filteredData);

  const paginatedData = sortedStates.slice(pagination?.startIndex, pagination?.endIndex + 1);

  return (
    <>
      <ListPageHeader title={t(NodeNetworkStateModel.label)}></ListPageHeader>
      <ListPageBody>
        <StatusBox loaded={statesLoaded} error={statesError}>
          <div className="nns-list-management-group">
            <Flex>
              <ListPageFilter
                data={data}
                loaded={statesLoaded}
                rowFilters={filters}
                rowSearchFilters={searchFilters}
                hideLabelFilter
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
              <Button onClick={() => setExpandAll(!expandAll)}>
                {expandAll ? t('Collapse all') : t('Expand all')}
              </Button>
            </Flex>
            <Pagination
              onPerPageSelect={(_e, perPage, page, startIndex, endIndex) =>
                onPaginationChange({ endIndex, page, perPage, startIndex })
              }
              onSetPage={(_e, page, perPage, startIndex, endIndex) =>
                onPaginationChange({ endIndex, page, perPage, startIndex })
              }
              className="list-managment-group__pagination"
              itemCount={sortedStates?.length}
              page={pagination?.page}
              perPage={pagination?.perPage}
              perPageOptions={paginationDefaultValues}
            />
          </div>

          {sortedStates?.length ? (
            <Table gridBreakPoint={TableGridBreakpoint.none} role="presentation">
              <Thead>
                <Tr>
                  {activeColumns.map((column) => (
                    <Th
                      key={column.id}
                      {...column?.props}
                      sort={column.id === COLUMN_NAME_ID ? nameSortParams : null}
                    >
                      {column.title}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              {paginatedData.map((nnstate, index) => (
                <StateRow
                  key={nnstate?.metadata?.name}
                  obj={nnstate}
                  activeColumnIDs={new Set(activeColumns.map(({ id }) => id))}
                  rowData={{ rowIndex: index, selectedFilters, expandAll }}
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
