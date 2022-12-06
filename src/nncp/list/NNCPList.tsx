import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  NodeNetworkConfigurationPolicyModelGroupVersionKind,
  NodeNetworkConfigurationPolicyModelRef,
} from 'nmstate-ts';
import { V1NodeNetworkConfigurationPolicy } from 'nmstate-ts';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import {
  ListPageBody,
  ListPageCreateDropdown,
  ListPageHeader,
  useK8sWatchResource,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';

import NNCPRow from './components/NNCPRow';
import useNNCPColumns from './hooks/useNNCPColumns';

const NNCPList: React.FC = () => {
  const { t } = useNMStateTranslation();
  const history = useHistory();

  const [nncps, loaded, loadError] = useK8sWatchResource<V1NodeNetworkConfigurationPolicy[]>({
    groupVersionKind: NodeNetworkConfigurationPolicyModelGroupVersionKind,
    isList: true,
    namespaced: false,
  });

  const createItems = {
    catalog: t('From Form'),
    yaml: t('With YAML'),
  };

  const onCreate = (type: string) => {
    return type === 'catalog'
      ? history.push(`/k8s/cluster/${NodeNetworkConfigurationPolicyModelRef}/~new/form`)
      : history.push(`/k8s/cluster/${NodeNetworkConfigurationPolicyModelRef}/~new/yaml`);
  };

  const [_, activeColumns] = useNNCPColumns();

  return (
    <>
      <ListPageHeader title={t('Node network configuration policy')}>
        <ListPageCreateDropdown
          items={createItems}
          onClick={onCreate}
          createAccessReview={{
            groupVersionKind: NodeNetworkConfigurationPolicyModelRef,
          }}
        >
          {t('Create')}
        </ListPageCreateDropdown>
      </ListPageHeader>
      <ListPageBody>
        <VirtualizedTable<V1NodeNetworkConfigurationPolicy>
          data={nncps}
          unfilteredData={nncps}
          loaded={loaded}
          columns={activeColumns}
          loadError={loadError}
          Row={NNCPRow}
        />
      </ListPageBody>
    </>
  );
};

export default NNCPList;
