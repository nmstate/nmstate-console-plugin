import {
  CHASSIS_ID,
  IEE_802_1_VLANS,
  NodeNetworkConfigurationInterfaceLLDPNeighbor,
  PORT_ID,
  SYSTEM_DESCRIPTION,
  SYSTEM_NAME,
} from 'src/nmstate-types/custom-models/NodeNetworkConfigurationInterfaceLLDP';

export const getNeighborInformations = (
  neighbor: NodeNetworkConfigurationInterfaceLLDPNeighbor,
  property: string,
) => neighbor.find((n) => n[property])?.[property];

export const getDescription = (neighbor, property) =>
  neighbor.find((n) => n[property])?._description;

export const getPortId = (neighbor) => getNeighborInformations(neighbor, PORT_ID);
export const getChassisId = (neighbor) => getNeighborInformations(neighbor, CHASSIS_ID);
export const getSystemName = (neighbor) => getNeighborInformations(neighbor, SYSTEM_NAME);
export const getSystemDescription = (neighbor) =>
  getNeighborInformations(neighbor, SYSTEM_DESCRIPTION);
export const getIee8021Vlans = (neighbor) => getNeighborInformations(neighbor, IEE_802_1_VLANS);
