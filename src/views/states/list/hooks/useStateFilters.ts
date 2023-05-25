import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { RowFilter } from '@openshift-console/dynamic-plugin-sdk';
import { V1beta1NodeNetworkState } from '@types';

const useStateFilters = (): RowFilter<V1beta1NodeNetworkState>[] => {
  const { t } = useNMStateTranslation();

  return [
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
