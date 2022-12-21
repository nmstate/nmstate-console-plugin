import { K8sModel } from '@openshift-console/dynamic-plugin-sdk';

import { modelToGroupVersionKind, modelToRef } from './modelUtils';

const NodeModel: K8sModel = {
  apiVersion: 'v1',
  label: 'Node',
  labelKey: 'public~Node',
  plural: 'nodes',
  abbr: 'N',
  kind: 'Node',
  id: 'node',
  labelPlural: 'Nodes',
  labelPluralKey: 'public~Nodes',
};

export const NodeModelGroupVersionKind = modelToGroupVersionKind(NodeModel);
export const NodeModelRef = modelToRef(NodeModel);

export default NodeModel;
