import { InterfaceType, NodeNetworkConfigurationInterface } from '@types';
import { isEmpty } from '@utils/helpers';

import { FILTER_TYPES, LLDP_ENABLED } from '../constants';
import { searchInterfaceByIP } from '../utilts';

export const interfaceFilters: Record<
  string,
  (selectedInput: string[], obj: NodeNetworkConfigurationInterface) => boolean
> = {
  [FILTER_TYPES.INTERFACE_STATE]: (selectedInput, obj) => {
    if (isEmpty(selectedInput)) return true;
    return selectedInput.some((status) => obj.state.toLowerCase() === status);
  },
  [FILTER_TYPES.INTERFACE_TYPE]: (selectedInput, obj) => {
    if (isEmpty(selectedInput)) return true;
    return selectedInput.some((interfaceType) => obj.type === interfaceType);
  },
  [FILTER_TYPES.IP_FILTER]: (selectedInput, obj) => {
    if (isEmpty(selectedInput)) return true;
    return selectedInput.some((ipType) => !!obj[ipType]);
  },
  [FILTER_TYPES.IP_ADDRESS]: (selectedInput, obj) => {
    const searchIPAddress = selectedInput?.[0];

    return searchInterfaceByIP(searchIPAddress, obj);
  },
  [FILTER_TYPES.LLDP]: (selectedInput, obj) => {
    if (isEmpty(selectedInput)) return true;
    return selectedInput.some((status) =>
      status === LLDP_ENABLED ? Boolean(obj?.lldp?.enabled) : !obj?.lldp?.enabled,
    );
  },
} as const;

export const filterInterfaces = (
  interfaces: NodeNetworkConfigurationInterface[],
  selectedFilters,
) => {
  if (!Object.keys(selectedFilters).length) return interfaces;

  return interfaces.filter((iface) =>
    Object.keys(selectedFilters).every((filterType) => {
      const selectedValues = selectedFilters[filterType];
      const filter = interfaceFilters[filterType];

      if (!filter) return true;

      return filter(selectedValues, iface);
    }),
  );
};

export const getInterfacesByType = (filteredInterfaces: NodeNetworkConfigurationInterface[]) =>
  filteredInterfaces?.reduce((acc, iface) => {
    // Skip loopback interfaces from the list
    if (iface.type === InterfaceType.LOOPBACK) return acc;

    acc[iface.type] ??= [];
    acc[iface.type].push(iface);
    return acc;
  }, {} as { [key: string]: NodeNetworkConfigurationInterface[] });
