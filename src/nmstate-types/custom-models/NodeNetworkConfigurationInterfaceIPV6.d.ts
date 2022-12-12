import { NodeNetworkConfigurationInterfaceIPV6Address } from './NodeNetworkConfigurationInterfaceIPV6Address';
export interface NodeNetworkConfigurationInterfaceIPV6 {
  enabled?: boolean;
  dhcp?: boolean;
  autoconf?: boolean;
  auto_routes?: boolean;
  auto_gateway?: boolean;
  auto_dns?: boolean;
  auto_route_table_id?: number;
  /**
   * When dhcp or autoconf are true, the address defined in this property is also ignored
   */
  address?: NodeNetworkConfigurationInterfaceIPV6Address[];
  address_ip?: number;
}
