import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { RowFilter } from '@openshift-console/dynamic-plugin-sdk';
import { InterfaceType, NodeNetworkConfigurationInterface, V1beta1NodeNetworkState } from '@types';
import { getIPV4Address, getIPV6Address } from '@utils/interfaces/getters';

import { FILTER_TYPES } from '../constants';

const useStateFilters = (): RowFilter<V1beta1NodeNetworkState>[] => {
  const { t } = useNMStateTranslation();

  return [
    {
      type: FILTER_TYPES.IP_ADDRESS,
      filter: (searchText, obj) => {
        const searchIPAddress = searchText?.selected?.[0];
        if (!searchIPAddress) return true;

        const interfaces = obj?.status?.currentState
          ?.interfaces as NodeNetworkConfigurationInterface[];

        const addresses = interfaces
          ?.reduce((acc, iface) => [...acc, getIPV4Address(iface), getIPV6Address(iface)], [])
          .filter(Boolean);

        return addresses?.some((address) => address?.toLowerCase().includes(searchIPAddress));
      },
      isMatch: () => true,
      filterGroupName: t('Search IP address'),
      items: [],
    },
    {
      filterGroupName: t('Interface state'),
      type: FILTER_TYPES.INTERFACE_STATE,
      filter: (selectedIpTypes, obj) => {
        if (!selectedIpTypes.selected.length) return true;
        return selectedIpTypes.selected.some((status) =>
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
        if (!selectedInterfaceTypes.selected.length) return true;
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
      ].map((interfaceType) => ({
        id: interfaceType,
        title: interfaceType,
      })),
    },
    {
      filterGroupName: t('IP'),
      type: FILTER_TYPES.IP_FILTER,
      filter: (selectedIpTypes, obj) => {
        if (!selectedIpTypes.selected.length) return true;
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

export default useStateFilters;
