import { InterfaceType, NodeNetworkConfigurationInterface } from '@types';

import { FILTERS_TYPES } from '../constants';

export const interfaceFilters = {
  [FILTERS_TYPES.INTERFACE_STATE]: (selectedInput, obj) => {
    if (!selectedInput.length) return true;
    return selectedInput.some((status) => obj.state.toLowerCase() === status);
  },
  [FILTERS_TYPES.INTERFACE_TYPE]: (selectedInput, obj) => {
    if (!selectedInput.length) return true;
    return selectedInput.some((interfaceType) => obj.type === interfaceType);
  },
  [FILTERS_TYPES.IP_FILTER]: (selectedInput, obj) => {
    if (!selectedInput.length) return true;
    return selectedInput.some((ipType) => !!obj[ipType]);
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
