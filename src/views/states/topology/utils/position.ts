import { Point, Visualization } from '@patternfly/react-topology';

import { TOPOLOGY_LOCAL_STORAGE_KEY } from './constants';

export const saveNodePositions = (visualization: Visualization) => {
  const graph = visualization.getGraph();
  const nodePositions = {};

  // Traverse all nodes and their children
  graph.getNodes().forEach((node) => {
    if (node.isGroup()) {
      // Save the group node position
      nodePositions[node.getId()] = node.getPosition();

      // Save all child node positions
      node.getAllNodeChildren().forEach((childNode) => {
        nodePositions[childNode.getId()] = childNode.getPosition();
      });
    } else {
      nodePositions[node.getId()] = node.getPosition();
    }
  });

  localStorage.setItem(TOPOLOGY_LOCAL_STORAGE_KEY, JSON.stringify(nodePositions));
};

export const restoreNodePositions = (visualization: Visualization) => {
  const savedPositions = localStorage.getItem(TOPOLOGY_LOCAL_STORAGE_KEY);
  if (savedPositions) {
    const nodePositions = JSON.parse(savedPositions);
    const graph = visualization.getGraph();

    // Traverse all nodes and their children
    graph.getNodes().forEach((node) => {
      if (nodePositions[node.getId()]) {
        node.setPosition(new Point(nodePositions[node.getId()].x, nodePositions[node.getId()].y));
      }

      if (node.isGroup()) {
        node.getAllNodeChildren().forEach((childNode) => {
          if (nodePositions[childNode.getId()]) {
            childNode.setPosition(
              new Point(nodePositions[childNode.getId()].x, nodePositions[childNode.getId()].y),
            );
          }
        });
      }
    });
  }
};
