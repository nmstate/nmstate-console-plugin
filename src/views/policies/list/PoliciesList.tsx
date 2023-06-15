import React, { FC, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  NodeNetworkConfigurationEnactmentModelGroupVersionKind,
  NodeNetworkConfigurationPolicyModelGroupVersionKind,
  NodeNetworkConfigurationPolicyModelRef,
} from 'src/console-models';
import NodeNetworkConfigurationPolicyModel from 'src/console-models/NodeNetworkConfigurationPolicyModel';
import { ENACTMENT_LABEL_POLICY } from 'src/utils/constants';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import {
  ListPageBody,
  ListPageCreateDropdown,
  ListPageFilter,
  ListPageHeader,
  useK8sWatchResource,
  useListPageFilter,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import { V1beta1NodeNetworkConfigurationEnactment, V1NodeNetworkConfigurationPolicy } from '@types';
import { getResourceUrl } from '@utils/helpers';

import { EnactmentStatuses } from '../constants';

import PolicyEnactmentsDrawer from './components/PolicyEnactmentsDrawer/PolicyEnactmentsDrawer';
import PolicyListEmptyState from './components/PolicyListEmptyState/PolicyListEmptyState';
import PolicyRow from './components/PolicyRow';
import usePolicyColumns from './hooks/usePolicyColumns';
import usePolicyFilters from './hooks/usePolicyFilters';

const PoliciesList: FC = () => {
  const { t } = useNMStateTranslation();
  const history = useHistory();
  const [selectedPolicy, setSelectedPolicy] = useState<V1NodeNetworkConfigurationPolicy>();
  const [selectedState, setSelectedState] = useState<EnactmentStatuses>();

  const [policies, policiesLoaded, policiesLoadError] = useK8sWatchResource<
    V1NodeNetworkConfigurationPolicy[]
  >({
    groupVersionKind: NodeNetworkConfigurationPolicyModelGroupVersionKind,
    isList: true,
    namespaced: false,
  });

  const [enactments, enactmentsLoaded, enactmentsError] = useK8sWatchResource<
    V1beta1NodeNetworkConfigurationEnactment[]
  >({
    groupVersionKind: NodeNetworkConfigurationEnactmentModelGroupVersionKind,
    isList: true,
  });

  const createItems = {
    form: t('From Form'),
    yaml: t('With YAML'),
  };

  const onCreate = (type: string) => {
    const baseURL = getResourceUrl({
      model: NodeNetworkConfigurationPolicyModel,
    });

    return type === 'form' ? history.push(`${baseURL}~new/form`) : history.push(`${baseURL}~new`);
  };

  const [columns, activeColumns] = usePolicyColumns();
  const filters = usePolicyFilters(enactments);
  const [data, filteredData, onFilterChange] = useListPageFilter(policies, filters);

  const selectedPolicyEnactments = selectedPolicy
    ? enactments.filter(
        (enactment) =>
          enactment?.metadata?.labels?.[ENACTMENT_LABEL_POLICY] === selectedPolicy?.metadata?.name,
      )
    : [];

  const onSelectPolicy = useCallback(
    (policy: V1NodeNetworkConfigurationPolicy, state: EnactmentStatuses) => {
      setSelectedPolicy(policy);
      setSelectedState(state);
    },
    [],
  );

  return (
    <>
      <ListPageHeader title={t(NodeNetworkConfigurationPolicyModel.label)}>
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
        <ListPageFilter
          data={data}
          loaded={policiesLoaded}
          rowFilters={filters}
          onFilterChange={onFilterChange}
          columnLayout={{
            columns: columns?.map(({ id, title, additional }) => ({
              id,
              title,
              additional,
            })),
            id: NodeNetworkConfigurationPolicyModelRef,
            selectedColumns: new Set(activeColumns?.map((col) => col?.id)),
            type: t('NodeNetworkConfigurationPolicy'),
          }}
        />

        <VirtualizedTable<V1NodeNetworkConfigurationPolicy>
          data={filteredData}
          unfilteredData={data}
          loaded={policiesLoaded && enactmentsLoaded}
          columns={activeColumns}
          loadError={policiesLoadError && enactmentsError}
          Row={PolicyRow}
          rowData={{ selectPolicy: onSelectPolicy, enactments }}
          NoDataEmptyMsg={() => <PolicyListEmptyState />}
        />

        <PolicyEnactmentsDrawer
          selectedPolicy={selectedPolicy}
          selectedState={selectedState}
          onClose={() => {
            setSelectedPolicy(undefined);
            setSelectedState(undefined);
          }}
          enactments={selectedPolicyEnactments}
        />
      </ListPageBody>
    </>
  );
};

export default PoliciesList;
