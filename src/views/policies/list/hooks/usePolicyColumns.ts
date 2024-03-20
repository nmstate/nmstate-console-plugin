import { useMemo } from 'react';
import { NodeNetworkConfigurationPolicyModelRef } from 'src/console-models';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import {
  K8sResourceCommon,
  TableColumn,
  useActiveColumns,
} from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';

const usePolicyColumns = (): [
  TableColumn<K8sResourceCommon>[],
  TableColumn<K8sResourceCommon>[],
] => {
  const { t } = useNMStateTranslation();

  const columns: TableColumn<K8sResourceCommon>[] = useMemo(
    () => [
      {
        title: t('Name'),
        id: 'name',
        transforms: [sortable],
        sort: 'metadata.name',
        props: { className: 'pf-m-width-30' },
      },
      {
        title: t('Matched nodes'),
        id: 'nodes',
        props: { className: 'pf-m-width-30' },
      },
      {
        title: t('Enactment states'),
        id: 'status',
        props: { className: 'pf-m-width-30' },
      },
      {
        title: '',
        id: '',
        props: { className: 'dropdown-kebab-pf pf-v5-c-table__action' },
      },
    ],
    [t],
  );

  const [activeColumns] = useActiveColumns<K8sResourceCommon>({
    columns: columns,
    showNamespaceOverride: false,
    columnManagementID: NodeNetworkConfigurationPolicyModelRef,
  });

  return [columns, activeColumns];
};

export default usePolicyColumns;
