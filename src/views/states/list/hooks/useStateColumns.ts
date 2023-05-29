import { useMemo } from 'react';
import { NodeNetworkStateModelRef } from 'src/console-models';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import {
  K8sResourceCommon,
  TableColumn,
  useActiveColumns,
} from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';

const useStateColumns = (): [
  TableColumn<K8sResourceCommon>[],
  TableColumn<K8sResourceCommon>[],
] => {
  const { t } = useNMStateTranslation();

  const columns: TableColumn<K8sResourceCommon>[] = [
    {
      title: t('Name'),
      id: 'name',
      transforms: [sortable],
      sort: 'metadata.name',
      props: { className: 'pf-m-width-30' },
    },
    {
      title: t('Network interface'),
      id: 'network-interface',
      props: { className: 'pf-m-width-50' },
    },
  ];

  const [activeColumns] = useActiveColumns<K8sResourceCommon>({
    columns: columns,
    showNamespaceOverride: false,
    columnManagementID: NodeNetworkStateModelRef,
  });

  return [columns, activeColumns];
};

export default useStateColumns;
