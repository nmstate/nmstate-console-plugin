import { NodeNetworkConfigurationInterface } from '@types';

export const getIPV4Address = (iface: NodeNetworkConfigurationInterface) =>
  iface?.ipv4?.address?.[0]?.ip;

export const getIPV6Address = (iface: NodeNetworkConfigurationInterface) =>
  iface?.ipv6?.address?.[0]?.ip;

export const getPorts = (iface: NodeNetworkConfigurationInterface) =>
  [
    ...(iface.bridge?.port?.map((port) => port.name) || []),
    ...(iface['link-aggregation']?.port || []),
  ].sort();
