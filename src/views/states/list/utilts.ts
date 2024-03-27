import {
  IEE_802_1_VLANS,
  SYSTEM_NAME,
} from 'src/nmstate-types/custom-models/NodeNetworkConfigurationInterfaceLLDP';

import { NodeNetworkConfigurationInterface } from '@types';
import { isEmpty } from '@utils/helpers';
import { getIPV4Address, getIPV6Address } from '@utils/interfaces/getters';

const decimalToBinary = (decimalNumber: number) => (decimalNumber >>> 0).toString(2);

const ipv4StringToBinary = (ip: string) =>
  ip
    .split('.')
    .map((classes) => decimalToBinary(parseInt(classes)).padStart(8, '0'))
    .join('');

const convertIPv6ToBinary = (ip: string) => {
  const ipBinary = ip
    .toLowerCase()
    .replaceAll('::', ':0000:')
    .split(':')
    .map((ip) => parseInt(ip, 16).toString(2).padStart(16, '0'));
  return ipBinary.join('');
};

export const compareCIDR = (ipSearch: string, ip: string, isIPv4 = true) => {
  const [baseIp, range] = ipSearch.split('/');

  const baseIpBinary = isIPv4 ? ipv4StringToBinary(baseIp) : convertIPv6ToBinary(baseIp);

  const ipBinary = isIPv4 ? ipv4StringToBinary(ip) : convertIPv6ToBinary(baseIp);

  const rangeNumber = parseInt(range);

  const baseIpBinarySlice = baseIpBinary.slice(0, rangeNumber);
  const ipBinarySlice = ipBinary.slice(0, rangeNumber);

  return baseIpBinarySlice === ipBinarySlice;
};

export const searchInterfaceByIP = (
  searchIPAddress: string,
  iface: NodeNetworkConfigurationInterface,
) => {
  if (isEmpty(searchIPAddress)) return true;

  const isSearchByIpv4 = searchIPAddress.includes('.');

  if (searchIPAddress.includes('/')) {
    const ipv4Address = getIPV4Address(iface);
    const ipv6Address = getIPV6Address(iface);

    if (ipv4Address && isSearchByIpv4 && compareCIDR(searchIPAddress, ipv4Address)) {
      return true;
    }
    if (ipv6Address && !isSearchByIpv4 && compareCIDR(searchIPAddress, ipv6Address, false)) {
      return true;
    }
  }

  const addresses = [getIPV4Address(iface), getIPV6Address(iface)].filter(Boolean);

  return addresses?.some((address) => address?.toLowerCase().includes(searchIPAddress));
};

export const searchInterfaceByMAC = (
  searchMACAddress: string,
  iface: NodeNetworkConfigurationInterface,
) => {
  if (isEmpty(searchMACAddress)) return true;

  return iface?.['mac-address']?.includes(searchMACAddress) || false;
};

export const searchInterfaceByLLDPName = (
  searchLLDPName: string,
  iface: NodeNetworkConfigurationInterface,
) => {
  if (isEmpty(searchLLDPName)) return true;

  return iface?.lldp?.neighbors?.some((neighbor) => {
    const vlans = neighbor.find((infoItem) => infoItem[IEE_802_1_VLANS])?.[IEE_802_1_VLANS];

    return vlans.find((v) => v.name.includes(searchLLDPName));
  });
};

export const searchInterfaceByLLDPSystemName = (
  searchLLDPSystemName: string,
  iface: NodeNetworkConfigurationInterface,
) => {
  if (isEmpty(searchLLDPSystemName)) return true;

  return iface?.lldp?.neighbors?.some((neighbor) => {
    const systemName = neighbor.find((infoItem) => infoItem?.[SYSTEM_NAME])?.[SYSTEM_NAME];

    return systemName.includes(searchLLDPSystemName);
  });
};
