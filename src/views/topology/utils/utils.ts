import { Model, NodeShape, NodeStatus } from '@patternfly/react-topology';
import { NodeNetworkConfigurationInterface, V1beta1NodeNetworkState } from '@types';
import { NODE_DIAMETER } from './constants';
import { NetworkIcon } from '@patternfly/react-icons';

export const getStatus = (iface: NodeNetworkConfigurationInterface) => {
  const status = iface.state.toLowerCase();
  if (status === 'up') return NodeStatus.success;
  if (status === 'down') return NodeStatus.danger;
  if (status === 'absent') return NodeStatus.warning;
  return NodeStatus.default;
};

export const transformDataToTopologyModel = (data: V1beta1NodeNetworkState[]): Model => {
  const nodes = data
    .map((nodeState) => {
      const childNodes = nodeState.status.currentState.interfaces.map(
        (iface: NodeNetworkConfigurationInterface) => ({
          id: `${nodeState.metadata.name}-${iface.name}`,
          type: 'node',
          label: iface.name,
          width: NODE_DIAMETER,
          height: NODE_DIAMETER,
          shape: NodeShape.ellipse,
          status: getStatus(iface),
          data: {
            badge: 'I', // Which kind should be each one?
            icon: NetworkIcon,
          },
          parent: nodeState.metadata.name, // Specify the parent group
        }),
      );

      const groupNode = {
        id: nodeState.metadata.name,
        type: 'group',
        label: nodeState.metadata.name,
        group: true,
        children: childNodes.map((child) => child.id),
        style: {
          padding: 40,
        },
      };

      return [groupNode, ...childNodes];
    })
    .flat();

  const edges: any[] = [];

  return {
    nodes,
    edges,
    graph: {
      id: 'g1',
      type: 'graph',
      layout: 'Cola',
    },
  };
};
