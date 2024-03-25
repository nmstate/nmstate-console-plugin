import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { RowFilter, RowSearchFilter } from '@openshift-console/dynamic-plugin-sdk';
import { InterfaceType, NodeNetworkConfigurationInterface, V1beta1NodeNetworkState } from '@types';
import { isEmpty } from '@utils/helpers';
import { getInterfaces } from '@utils/nns/getters';

import { FILTER_TYPES, LLDP_DISABLED, LLDP_ENABLED } from '../constants';
import {
  searchInterfaceByIP,
  searchInterfaceByLLDPName,
  searchInterfaceByLLDPSystemName,
  searchInterfaceByMAC,
} from '../utilts';

export const useStateSearchFilters = (): RowSearchFilter<V1beta1NodeNetworkState>[] => {
  const { t } = useNMStateTranslation();
  return [
    {
      type: FILTER_TYPES.IP_ADDRESS,
      filter: (searchText, obj) => {
        const searchIPAddress = searchText?.selected?.[0];
        if (!searchIPAddress) return true;

        const interfaces = getInterfaces(obj);

        return interfaces?.some((iface) => searchInterfaceByIP(searchIPAddress, iface));
      },
      filterGroupName: t('IP address'),
      placeholder: t('Search by IP address...'),
    },
    {
      type: FILTER_TYPES.MAC_ADDRESS,
      filter: (searchText, obj) => {
        const searchMACAddress = searchText?.selected?.[0];
        if (!searchMACAddress) return true;

        const interfaces = getInterfaces(obj);

        return interfaces?.some((iface) => searchInterfaceByMAC(searchMACAddress, iface));
      },
      filterGroupName: t('MAC address'),
      placeholder: t('Search by MAC address...'),
    },
    {
      type: FILTER_TYPES.LLDP_NAME,
      filter: (searchText, obj) => {
        const searchLLDPName = searchText?.selected?.[0];
        if (isEmpty(searchLLDPName)) return true;

        const interfaces = getInterfaces(obj);

        return interfaces?.some((iface) => searchInterfaceByLLDPName(searchLLDPName, iface));
      },
      filterGroupName: t('LLDP VLAN name'),
      placeholder: t('Search by VLAN name...'),
    },
    {
      type: FILTER_TYPES.LLDP_SYSTEM_NAME,
      filter: (searchText, obj) => {
        const searchSystemName = searchText?.selected?.[0];
        if (isEmpty(searchSystemName)) return true;

        const interfaces = getInterfaces(obj);

        return interfaces?.some((iface) =>
          searchInterfaceByLLDPSystemName(searchSystemName, iface),
        );
      },
      filterGroupName: t('LLDP system name'),
      placeholder: t('Search by LLDP system name...'),
    },
  ];
};

export const useStateFilters = (): RowFilter<V1beta1NodeNetworkState>[] => {
  const { t } = useNMStateTranslation();

  return [
    {
      filterGroupName: t('LLDP'),
      type: FILTER_TYPES.LLDP,
      filter: (selectedLLDPStatus, obj) => {
        if (isEmpty(selectedLLDPStatus.selected)) return true;
        return selectedLLDPStatus.selected.some((status) =>
          getInterfaces(obj).some((iface) =>
            status === LLDP_ENABLED ? Boolean(iface?.lldp?.enabled) : !iface?.lldp?.enabled,
          ),
        );
      },
      isMatch: (obj, status) =>
        getInterfaces(obj).some((iface) =>
          status === LLDP_ENABLED ? Boolean(iface?.lldp?.enabled) : !iface?.lldp?.enabled,
        ),
      items: [
        {
          id: LLDP_ENABLED,
          title: t('Enabled'),
        },
        {
          id: LLDP_DISABLED,
          title: t('Disabled'),
        },
      ],
    },
    {
      filterGroupName: t('Interface state'),
      type: FILTER_TYPES.INTERFACE_STATE,
      filter: (selectedInfaceState, obj) => {
        if (isEmpty(selectedInfaceState.selected)) return true;
        return selectedInfaceState.selected.some((status) =>
          getInterfaces(obj).some((iface) => iface.state.toLowerCase() === status),
        );
      },
      isMatch: (obj, status) =>
        getInterfaces(obj).some((iface) => iface.state.toLowerCase() === status),
      items: [
        {
          id: 'up',
          title: t('Up'),
        },
        {
          id: 'down',
          title: t('Down'),
        },
      ],
    },
    {
      filterGroupName: t('Interface type'),
      type: FILTER_TYPES.INTERFACE_TYPE,
      filter: (selectedInterfaceTypes, obj) => {
        if (isEmpty(selectedInterfaceTypes.selected)) return true;
        return selectedInterfaceTypes.selected.some((interfaceType) =>
          getInterfaces(obj).some(
            (iface: NodeNetworkConfigurationInterface) => iface.type === interfaceType,
          ),
        );
      },
      isMatch: (obj, interfaceType) =>
        getInterfaces(obj).some(
          (iface: NodeNetworkConfigurationInterface) => iface.type === interfaceType,
        ),
      items: [
        InterfaceType.OVS_BRIDGE,
        InterfaceType.OVS_INTERFACE,
        InterfaceType.BOND,
        InterfaceType.ETHERNET,
        InterfaceType.LINUX_BRIDGE,
      ].map((interfaceType) => ({
        id: interfaceType,
        title: interfaceType,
      })),
    },
    {
      filterGroupName: t('IP'),
      type: FILTER_TYPES.IP_FILTER,
      filter: (selectedIpTypes, obj) => {
        if (isEmpty(selectedIpTypes.selected)) return true;
        return selectedIpTypes.selected.some((ipType) =>
          getInterfaces(obj).some((i) => !!i[ipType]),
        );
      },
      isMatch: (obj, ipType) => getInterfaces(obj).some((i) => !!i[ipType]),
      items: [
        {
          id: 'ipv4',
          title: t('IPv4'),
        },
        {
          id: 'ipv6',
          title: t('IPv6'),
        },
      ],
    },
  ];
};
