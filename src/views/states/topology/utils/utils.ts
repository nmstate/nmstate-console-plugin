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
import { isEmpty } from '@utils/helpers';

import BridgeIcon from '../components/BridgeIcon';

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
  if (
    iface.bridge ||
    iface.type === InterfaceType.OVS_BRIDGE ||
    iface.type === InterfaceType.LINUX_BRIDGE
  )
    return BridgeIcon;
  if (iface.ethernet || iface.type === InterfaceType.ETHERNET) return EthernetIcon;
  if (iface.type === InterfaceType.BOND) return LinkIcon;
  return NetworkIcon;
};

const createNodes = (
  nnsName: string,
  interfaces: NodeNetworkConfigurationInterface[],
): NodeModel[] =>
  interfaces.map((iface) => ({
    id: `${nnsName}~${iface.name}~${iface.type}`,
    type: ModelKind.node,
    label: iface.name,
    width: NODE_DIAMETER,
    height: NODE_DIAMETER,
    visible: !iface.patch && iface.type !== InterfaceType.LOOPBACK,
    shape: NodeShape.circle,
    status: getStatus(iface),
    data: {
      icon: getIcon(iface),
      type: iface.type,
      bridgePorts: iface.bridge?.port,
      bondPorts: iface['link-aggregation']?.port,
      vlanBaseInterface: iface.vlan?.['base-iface'],
    },
    parent: nnsName,
  }));

const createEdges = (childNodes: NodeModel[]): EdgeModel[] => {
  const edges: EdgeModel[] = [];

  childNodes?.forEach((sourceNode) => {
    // Find bridge connections
    if (!isEmpty(sourceNode.data?.bridgePorts)) {
      sourceNode.data?.bridgePorts?.forEach((port) => {
        const targetNode = childNodes.find(
          (target) => target.label === port.name && target.id !== sourceNode.id,
        );

        if (!isEmpty(targetNode)) {
          edges.push({
            id: `${sourceNode.id}~${targetNode.id}-edge`,
            type: ModelKind.edge,
            source: sourceNode.id,
            target: targetNode.id,
          });
        }
      });
    }

    // Find bond connections
    if (!isEmpty(sourceNode.data?.vlanBaseInterface)) {
      sourceNode.data?.bondPorts?.forEach((port) => {
        const targetNode = childNodes.find(
          (target) => target.label === port && target.id !== sourceNode.id,
        );

        if (!isEmpty(targetNode)) {
          edges.push({
            id: `${sourceNode.id}~${targetNode.id}-edge`,
            type: ModelKind.edge,
            source: sourceNode.id,
            target: targetNode.id,
          });
        }
      });
    }

    // Find vlan connections
    if (!isEmpty(sourceNode.data?.bondPorts)) {
      const baseInterface = sourceNode.data?.vlanBaseInterface;

      const targetNode = childNodes.find(
        (target) => target.label === baseInterface && target.id !== sourceNode.id,
      );

      if (!isEmpty(targetNode)) {
        edges.push({
          id: `${sourceNode.id}~${targetNode.id}-edge`,
          type: ModelKind.edge,
          source: sourceNode.id,
          target: targetNode.id,
        });
      }
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
  filteredData?: V1beta1NodeNetworkState[],
): Model => {
  const nodes: NodeModel[] = [];
  const edges: EdgeModel[] = [];

  data?.forEach((nodeState) => {
    const nnsName = nodeState.metadata.name;

    const childNodes = createNodes(nnsName, nodeState.status.currentState.interfaces);

    const isVisible = filteredData
      ? filteredData.some((filteredState) => filteredState.metadata.name === nnsName)
      : true;

    const groupNode = createGroupNode(
      nnsName,
      childNodes.map((child) => child.id),
      isVisible,
    );
    nodes.push(groupNode, ...childNodes);

    const nodeEdges = createEdges(childNodes);

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
