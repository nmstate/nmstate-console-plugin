import { ENACTMENT_LABEL_POLICY } from 'src/utils/constants';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { RowFilter } from '@openshift-console/dynamic-plugin-sdk';
import { V1beta1NodeNetworkConfigurationEnactment, V1NodeNetworkConfigurationPolicy } from '@types';

import { getEnactmentStatus } from '../components/utils';

const usePolicyFilters = (
  enactments: V1beta1NodeNetworkConfigurationEnactment[],
): RowFilter<V1NodeNetworkConfigurationPolicy>[] => {
  const { t } = useNMStateTranslation();

  const enactmentsByPolicies = enactments.reduce((acc, enactment) => {
    const status = getEnactmentStatus(enactment);

    if (!acc[enactment?.metadata?.labels?.[ENACTMENT_LABEL_POLICY]]) {
      acc[enactment?.metadata?.labels?.[ENACTMENT_LABEL_POLICY]] = {};
    }

    acc[enactment?.metadata?.labels?.[ENACTMENT_LABEL_POLICY]][status] = true;
    return acc;
  }, {});

  return [
    {
      filterGroupName: t('Enactment states'),
      type: 'enactment-state',
      isMatch: (obj, status) => enactmentsByPolicies[obj?.metadata?.name]?.[status],
      filter: ({ selected }, obj) =>
        selected?.length === 0 ||
        selected.some((status) => enactmentsByPolicies[obj?.metadata?.name][status]),
      items: [
        {
          id: 'Failing',
          title: t('Failing'),
        },
        {
          id: 'Aborted',
          title: t('Aborted'),
        },
        {
          id: 'Available',
          title: t('Available'),
        },
        {
          id: 'Progressing',
          title: t('Progressing'),
        },
        {
          id: 'Pending',
          title: t('Pending'),
        },
      ],
    },
  ];
};

export default usePolicyFilters;
