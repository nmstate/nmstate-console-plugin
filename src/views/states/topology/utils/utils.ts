import { EthernetIcon, LinkIcon, NetworkIcon } from '@patternfly/react-icons';
import {
  EdgeModel,
  Model,
  ModelKind,
  NodeModel,
  NodeShape,
  NodeStatus,
} from '@patternfly/react-topology';
import { InterfaceType, NodeNetworkConfigurationInterface, V1beta1NodeNetworkState } from '@types';

import { GROUP, NODE_DIAMETER } from './constants';

const statusMap: { [key: string]: NodeStatus } = {
  up: NodeStatus.success,
  down: NodeStatus.danger,
  absent: NodeStatus.warning,
};

const getStatus = (iface: NodeNetworkConfigurationInterface): NodeStatus => {
  return statusMap[iface.state.toLowerCase()] || NodeStatus.default;
};

const getIcon = (iface: NodeNetworkConfigurationInterface) => {
  if (iface.ethernet || iface.type === InterfaceType.ETHERNET) return EthernetIcon;
  if (iface.type === InterfaceType.BOND) return LinkIcon;
  return NetworkIcon;
};

const createNodes = (
  nnsName: string,
  interfaces: NodeNetworkConfigurationInterface[],
): NodeModel[] => {
  return interfaces.map((iface) => {
    const icon = getIcon(iface);
    return {
      id: `${nnsName}~${iface.name}`,
      type: ModelKind.node,
      label: iface.name,
      width: NODE_DIAMETER,
      height: NODE_DIAMETER,
      visible: !iface.patch && iface.type !== InterfaceType.LOOPBACK,
      shape: NodeShape.circle,
      status: getStatus(iface),
      data: {
        badge: 'I',
        icon,
      },
      parent: nnsName,
    };
  });
};

const createEdges = (
  nnsName: string,
  interfaces: NodeNetworkConfigurationInterface[],
): EdgeModel[] => {
  const edges: EdgeModel[] = [];
  const patchConnections: { [key: string]: string } = {};

  interfaces.forEach((iface: NodeNetworkConfigurationInterface) => {
    if (iface.patch?.peer) {
      patchConnections[iface.name] = iface.patch.peer;
    }
  });

  interfaces.forEach((iface: NodeNetworkConfigurationInterface) => {
    const nodeId = `${nnsName}~${iface.name}`;

    if (iface.bridge?.port) {
      iface.bridge.port.forEach((prt) => {
        if (patchConnections[prt.name]) {
          const peerPatch = patchConnections[prt.name];
          const peerBridge = interfaces.find((intf) =>
            intf.bridge?.port.some((p) => p.name === peerPatch),
          );

          if (peerBridge) {
            const peerBridgeId = `${nnsName}~${peerBridge.name}`;
            edges.push({
              id: `${nodeId}~${peerBridgeId}-edge`,
              type: ModelKind.edge,
              source: nodeId,
              target: peerBridgeId,
            });
          }
        } else if (prt.name && iface.name !== prt.name) {
          edges.push({
            id: `${nodeId}~${prt.name}-edge`,
            type: ModelKind.edge,
            source: nodeId,
            target: `${nnsName}~${prt.name}`,
          });
        }
      });
    }

    if (iface.vlan?.['base-iface'] && iface.name !== iface.vlan?.['base-iface']) {
      edges.push({
        id: `${nodeId}~${iface.vlan['base-iface']}-edge`,
        type: ModelKind.edge,
        source: nodeId,
        target: `${nnsName}~${iface.vlan['base-iface']}`,
      });
    }

    if (iface['link-aggregation']?.port) {
      iface['link-aggregation'].port.forEach((prt: string) => {
        if (iface.name !== prt) {
          edges.push({
            id: `${nodeId}~${prt}-edge`,
            type: ModelKind.edge,
            source: nodeId,
            target: `${nnsName}~${prt}`,
          });
        }
      });
    }
  });

  return edges;
};

const createGroupNode = (nnsName: string, childNodeIds: string[], visible: boolean): NodeModel => {
  return {
    id: nnsName,
    type: GROUP,
    label: nnsName,
    group: true,
    children: childNodeIds,
    visible,
    style: {
      padding: 40,
    },
    data: {
      badge: 'NNS',
    },
  };
};

export const transformDataToTopologyModel = (
  data: V1beta1NodeNetworkState[],
  filteredData?: V1beta1NodeNetworkState[], // Optional filtered data parameter
): Model => {
  const nodes: NodeModel[] = [];
  const edges: EdgeModel[] = [];

  data.forEach((nodeState) => {
    const nnsName = nodeState.metadata.name;

    const childNodes = createNodes(nnsName, nodeState.status.currentState.interfaces);

    // Determine visibility based on whether filteredData includes this nodeState
    const isVisible = filteredData
      ? filteredData.some((filteredState) => filteredState.metadata.name === nnsName)
      : true;

    const groupNode = createGroupNode(
      nnsName,
      childNodes.map((child) => child.id),
      isVisible,
    );
    const nodeEdges = createEdges(nnsName, nodeState.status.currentState.interfaces);

    nodes.push(groupNode, ...childNodes);
    edges.push(...nodeEdges);
  });

  return {
    nodes,
    edges,
    graph: {
      id: 'nns-topology',
      type: ModelKind.graph,
      layout: 'Cola',
    },
  };
};
