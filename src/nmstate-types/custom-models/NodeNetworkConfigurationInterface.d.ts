import { NodeNetworkConfigurationInterfaceIP } from './NodeNetworkConfigurationInterfaceIP';
import { NodeNetworkConfigurationInterfaceIPV4 } from './NodeNetworkConfigurationInterfaceIPV4';
import { NodeNetworkConfigurationInterfaceIPV6 } from './NodeNetworkConfigurationInterfaceIPV6';
import { InterfaceType } from './NodeNetworkConfigurationInterfaceType';
export interface NodeNetworkConfigurationInterface {
  name: string;
  description?: string;
  state: 'UP' | 'DOWN' | 'up' | 'down' | 'absent' | 'ABSENT';
  type: InterfaceType;
  mtu?: number;
  mac_address?: string;
  copy_mac_from?: string;
  interfaceip: NodeNetworkConfigurationInterfaceIP;
  ipv4?: NodeNetworkConfigurationInterfaceIPV4;
  ipv6?: NodeNetworkConfigurationInterfaceIPV6;
}
