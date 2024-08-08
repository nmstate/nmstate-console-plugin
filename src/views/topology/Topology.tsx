import React, { FC, useEffect, useState } from 'react';

import {
  SELECTION_EVENT,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  TopologyView,
  TopologyControlBar,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  action,
} from '@patternfly/react-topology';
import { V1beta1NodeNetworkState } from '@types';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { NodeNetworkStateModelGroupVersionKind } from '@models';
import { layoutFactory, componentFactory } from './utils/factory';
import { transformDataToTopologyModel } from './utils/utils';

const Topology: FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [visualization, setVisualization] = useState<Visualization>();

  const [data, loaded, error] = useK8sWatchResource<V1beta1NodeNetworkState[]>({
    groupVersionKind: NodeNetworkStateModelGroupVersionKind,
    isList: true,
    namespaced: false,
  });

  useEffect(() => {
    if (loaded && !error) {
      const topologyModel = transformDataToTopologyModel(data);

      const newController = new Visualization();
      newController.registerLayoutFactory(layoutFactory);
      newController.registerComponentFactory(componentFactory);

      newController.addEventListener(SELECTION_EVENT, setSelectedIds);
      newController.fromModel(topologyModel);
      newController.getGraph().getBounds();
      setVisualization(newController);
      console.log(
        '🚀 ~ useEffect ~ newController.getGraph().getBounds():',
        newController.getGraph().getBounds(),
      );
    }
  }, [data, loaded, error]);

  return (
    <TopologyView
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
              visualization.getGraph().fit(80);
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
