import React, { FC, useEffect, useRef } from 'react';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized';
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
import { Table, TableGridBreakpoint, TableHeader } from '@patternfly/react-table';
import { AutoSizer, VirtualTableBody } from '@patternfly/react-virtualized-extension';
import { V1beta1NodeNetworkState } from '@types';

import InterfaceDrawer from './components/InterfaceDrawer/InterfaceDrawer';
import StateRow from './components/StateRow';
import StatusBox from './components/StatusBox';
import { DrawerContextProvider } from './contexts/DrawerContext';
import useStateColumns from './hooks/useStateColumns';
import useStateFilters from './hooks/useStateFilters';

const StatesList: FC = () => {
  const { t } = useNMStateTranslation();
  const measurementCacheRef = useRef(null);

  const [states, statesLoaded, statesError] = useK8sWatchResource<V1beta1NodeNetworkState[]>({
    groupVersionKind: NodeNetworkStateModelGroupVersionKind,
    isList: true,
    namespaced: false,
  });

  const [columns, activeColumns] = useStateColumns();
  const filters = useStateFilters();
  const [data, filteredData, onFilterChange] = useListPageFilter(states, filters);

  useEffect(() => {
    measurementCacheRef.current = new CellMeasurerCache({
      fixedWidth: true,
      minHeight: 44,
      keyMapper: (rowIndex) => rowIndex,
    });
  }, []);

  const rowRenderer = ({ index, key, parent }) => {
    return (
      <CellMeasurer
        cache={measurementCacheRef.current}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <StateRow
          obj={filteredData[index]}
          activeColumnIDs={new Set(activeColumns.map(({ id }) => id))}
          rowData={{ rowIndex: index }}
        />
      </CellMeasurer>
    );
  };

  return (
    <DrawerContextProvider>
      <ListPageHeader title={t(NodeNetworkStateModel.label)}></ListPageHeader>
      <ListPageBody>
        <StatusBox loaded={statesLoaded} error={statesError} data={states}>
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

          <Table
            cells={activeColumns}
            rows={filteredData}
            gridBreakPoint={TableGridBreakpoint.none}
            role="presentation"
          >
            <TableHeader />
            {measurementCacheRef.current && (
              <AutoSizer disableHeight>
                {({ width }) => (
                  <VirtualTableBody
                    className="pf-c-table pf-c-virtualized pf-c-window-scroller"
                    deferredMeasurementCache={measurementCacheRef.current}
                    rowHeight={measurementCacheRef.current.rowHeight}
                    height={400}
                    overscanRowCount={2}
                    columnCount={1}
                    rows={filteredData}
                    rowCount={filteredData.length}
                    rowRenderer={rowRenderer}
                    width={width}
                  />
                )}
              </AutoSizer>
            )}
          </Table>
        </StatusBox>
      </ListPageBody>
      <InterfaceDrawer />
    </DrawerContextProvider>
  );
};

export default StatesList;
