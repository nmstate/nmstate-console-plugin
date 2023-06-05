import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { K8sResourceCommon, TableColumn } from '@openshift-console/dynamic-plugin-sdk';

const useInterfaceColumns = (): TableColumn<K8sResourceCommon>[] => {
  const { t } = useNMStateTranslation();

  const columns: TableColumn<K8sResourceCommon>[] = [
    {
      title: t('Name'),
      id: 'name',
      props: { className: 'pf-m-width-20' },
    },
    {
      title: t('IP address'),
      id: 'ip-address',
    },
    {
      title: t('Ports'),
      id: 'ports',
    },
    {
      title: t('Mac address'),
      id: 'mac-address',
    },
    {
      title: t('LLDP'),
      id: 'lldp',
    },
    {
      title: t('MTU'),
      id: 'mtu',
    },
  ];

  return columns;
};

export default useInterfaceColumns;
