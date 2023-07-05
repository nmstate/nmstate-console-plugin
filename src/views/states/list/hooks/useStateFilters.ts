import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { RowFilter } from '@openshift-console/dynamic-plugin-sdk';
import { InterfaceType, NodeNetworkConfigurationInterface, V1beta1NodeNetworkState } from '@types';

const useStateFilters = (): RowFilter<V1beta1NodeNetworkState>[] => {
  const { t } = useNMStateTranslation();

  return [
    {
      filterGroupName: t('Interface state'),
      type: 'interface-state',
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
      type: 'interface-type',
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
      type: 'ip-filter',
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
