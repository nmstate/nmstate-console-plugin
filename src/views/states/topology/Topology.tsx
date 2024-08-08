import React, { FC, useEffect, useMemo, useState } from 'react';

import { NodeNetworkStateModelGroupVersionKind } from '@models';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import {
  action,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  SELECTION_EVENT,
  TopologyControlBar,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
} from '@patternfly/react-topology';
import { V1beta1NodeNetworkState } from '@types';

import TopologySidebar from './components/TopologySidebar/TopologySidebar';
import TopologyToolbar from './components/TopologyToolbar/TopologyToolbar';
import { componentFactory, layoutFactory } from './utils/factory';
import { transformDataToTopologyModel } from './utils/utils';

const Topology: FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [visualization, setVisualization] = useState<Visualization>(null);

  const [selectedNodeFilters, setSelectedNodeFilters] = useState<string[]>([]);

  const [states, loaded, error] = useK8sWatchResource<V1beta1NodeNetworkState[]>({
    groupVersionKind: NodeNetworkStateModelGroupVersionKind,
    isList: true,
    namespaced: false,
  });

  const nodeNames: string[] = useMemo(
    () => states?.map((state) => state.metadata.name) || [],
    [states],
  );

  useEffect(() => {
    if (loaded && !error) {
      const topologyModel =
        selectedNodeFilters.length > 0
          ? transformDataToTopologyModel(
              states.filter((state) => selectedNodeFilters.includes(state.metadata.name)),
            )
          : transformDataToTopologyModel(states);

      if (!visualization) {
        const newVisualization = new Visualization();
        newVisualization.registerLayoutFactory(layoutFactory);
        newVisualization.registerComponentFactory(componentFactory);
        newVisualization.addEventListener(SELECTION_EVENT, setSelectedIds);
        newVisualization.setFitToScreenOnLayout(true);
        newVisualization.fromModel(topologyModel);
        setVisualization(newVisualization);
      } else {
        visualization.fromModel(topologyModel);
      }
    }
  }, [states, loaded, error, selectedNodeFilters]);

  return (
    <TopologyView
      sideBar={
        <TopologySidebar
          states={states}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      }
      viewToolbar={
        <TopologyToolbar
          nodeNames={nodeNames}
          selectedNodeFilters={selectedNodeFilters}
          setSelectedNodeFilters={setSelectedNodeFilters}
        />
      }
      controlBar={
        <TopologyControlBar
          controlButtons={createTopologyControlButtons({
            ...defaultControlButtonsOptions,
            zoomInCallback: action(() => {
              visualization.getGraph().scaleBy(4 / 3);
            }),
            zoomOutCallback: action(() => {
              visualization.getGraph().scaleBy(0.75);
            }),
            fitToScreenCallback: action(() => {
              visualization.getGraph().fit(40);
            }),
            resetViewCallback: action(() => {
              visualization.getGraph().reset();
              visualization.getGraph().layout();
            }),
            legend: false,
          })}
        />
      }
    >
      <VisualizationProvider controller={visualization}>
        <VisualizationSurface state={{ selectedIds }} />
      </VisualizationProvider>
    </TopologyView>
  );
};

export default Topology;
