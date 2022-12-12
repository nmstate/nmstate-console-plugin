export enum InterfaceType {
  ETHERNET = 'ETHERNET',
  BOND = 'BOND',
  LINUX_BRIDGE = 'LINUX_BRIDGE',
  OVS_BRIDGE = 'OVS_BRIDGE',
  OVS_PORT = 'OVS_PORT',
  OVS_INTERFACE = 'OVS_INTERFACE',
  VLAN = 'VLAN',
  VXLAN = 'VXLAN',
  TEAM = 'TEAM', // (deprecated since 1.3 and removed since 2.0)
  VRF = 'VRF',
  INFINIBAND = 'INFINIBAND',
  MAC_VLAN = 'MAC_VLAN',
  MAC_VTAP = 'MAC_VTAP',
  VETH = 'VETH',
}
