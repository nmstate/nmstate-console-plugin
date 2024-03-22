import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { RowFilter, RowSearchFilter } from '@openshift-console/dynamic-plugin-sdk';
import { InterfaceType, NodeNetworkConfigurationInterface, V1beta1NodeNetworkState } from '@types';
import { isEmpty } from '@utils/helpers';

import { FILTER_TYPES, LLDP_DISABLED, LLDP_ENABLED } from '../constants';
import { searchInterfaceByIP, searchInterfaceByMAC } from '../utilts';

export const useStateSearchFilters = (): RowSearchFilter<V1beta1NodeNetworkState>[] => {
  const { t } = useNMStateTranslation();
  return [
    {
      type: FILTER_TYPES.IP_ADDRESS,
      filter: (searchText, obj) => {
        const searchIPAddress = searchText?.selected?.[0];
        if (!searchIPAddress) return true;

        const interfaces = obj?.status?.currentState
          ?.interfaces as NodeNetworkConfigurationInterface[];

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

        const interfaces = obj?.status?.currentState
          ?.interfaces as NodeNetworkConfigurationInterface[];

        return interfaces?.some((iface) => searchInterfaceByMAC(searchMACAddress, iface));
      },
      filterGroupName: t('MAC address'),
      placeholder: t('Search by MAC address...'),
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
          obj?.status?.currentState?.interfaces.some((iface) =>
            status === LLDP_ENABLED ? Boolean(iface?.lldp?.enabled) : !iface?.lldp?.enabled,
          ),
        );
      },
      isMatch: (obj, status) =>
        obj?.status?.currentState?.interfaces.some((iface) =>
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
          obj?.status?.currentState?.interfaces.some(
            (iface) => iface.state.toLowerCase() === status,
          ),
        );
      },
      isMatch: (obj, status) =>
        obj?.status?.currentState?.interfaces.some((iface) => iface.state.toLowerCase() === status),
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
          obj?.status?.currentState?.interfaces.some(
            (iface: NodeNetworkConfigurationInterface) => iface.type === interfaceType,
          ),
        );
      },
      isMatch: (obj, interfaceType) =>
        obj?.status?.currentState?.interfaces.some(
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
          obj?.status?.currentState?.interfaces.some((i) => !!i[ipType]),
        );
      },
      isMatch: (obj, ipType) => obj?.status?.currentState?.interfaces.some((i) => !!i[ipType]),
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
