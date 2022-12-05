import { useMemo } from 'react';
import { NodeNetworkConfigurationPolicyModelRef } from 'nmstate-ts';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import {
  K8sResourceCommon,
  TableColumn,
  useActiveColumns,
} from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';

const useNNCPColumns = (): [TableColumn<K8sResourceCommon>[], TableColumn<K8sResourceCommon>[]] => {
  const { t } = useNMStateTranslation();

  const columns: TableColumn<K8sResourceCommon>[] = useMemo(
    () => [
      {
        title: t('Name'),
        id: 'name',
        transforms: [sortable],
        sort: 'metadata.name',
        props: { className: 'pf-m-width-15' },
      },
      {
        title: '',
        id: '',
        props: { className: 'dropdown-kebab-pf pf-c-table__action' },
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

export default useNNCPColumns;
