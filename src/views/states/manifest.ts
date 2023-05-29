import type { EncodedExtension } from '@openshift/dynamic-plugin-sdk';
import type {
  ExtensionK8sModel,
  ResourceClusterNavItem,
  ResourceListPage,
} from '@openshift-console/dynamic-plugin-sdk';

import NodeNetworkStateModel from '../../console-models/NodeNetworkStateModel';

const StateExtensionModel: ExtensionK8sModel = {
  group: NodeNetworkStateModel.apiGroup as string,
  kind: NodeNetworkStateModel.kind,
  version: NodeNetworkStateModel.apiVersion,
};

export const StateExposedModules = {
  StatesList: './views/states/list/StatesList',
};

export const StateExtensions: EncodedExtension[] = [
  {
    type: 'console.navigation/resource-cluster',
    properties: {
      id: 'state',
      perspective: 'admin',
      name: '%plugin__nmstate-console-plugin~NodeNetworkState%',
      section: 'networking',
      model: StateExtensionModel,
      dataAttributes: {
        'data-quickstart-id': 'qs-nav-state-list',
        'data-test-id': 'state-nav-list',
      },
    },
  } as EncodedExtension<ResourceClusterNavItem>,
  {
    type: 'console.page/resource/list',
    properties: {
      perspective: 'admin',
      model: StateExtensionModel,
      component: { $codeRef: 'StatesList' },
    },
  } as EncodedExtension<ResourceListPage>,
];
