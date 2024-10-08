import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

import { modelToGroupVersionKind, modelToRef } from './modelUtils';

export const NodeNetworkStateModel: K8sModel = {
  label: 'NodeNetworkState',
  labelPlural: 'NodeNetworkStates',
  apiVersion: 'v1beta1',
  apiGroup: 'nmstate.io',
  plural: 'nodenetworkstates',
  abbr: 'NNS',
  namespaced: false,
  kind: 'NodeNetworkState',
  id: 'NodeNetworkState',
  crd: true,
};

export const NodeNetworkStateModelGroupVersionKind = modelToGroupVersionKind(NodeNetworkStateModel);
export const NodeNetworkStateModelRef = modelToRef(NodeNetworkStateModel);
