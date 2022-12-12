import { NodeNetworkConfigurationInterfaceIPV4Address } from './NodeNetworkConfigurationInterfaceIPV4Address';
export interface NodeNetworkConfigurationInterfaceIPV4 {
  enabled: boolean;
  dhcp?: boolean;
  /**
   * This property only shows when dhcp is true when querying.
   * This property is ignored when dhcp is false when applying.
   */
  auto_routes?: boolean;
  /**
   * This property only shows when dhcp is true when querying.
   * This property is ignored when dhcp is false when applying.
   */
  auto_gateway?: boolean;
  /**
   * This property only shows when dhcp is true when querying.
   * This property is ignored when dhcp is false when applying.
   */
  auto_dns?: boolean;
  auto_route_table_id?: number;
  /** when dhcp is true, this property is ignored */
  address?: NodeNetworkConfigurationInterfaceIPV4Address[];
}
