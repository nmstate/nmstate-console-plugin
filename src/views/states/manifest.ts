import type { EncodedExtension } from '@openshift/dynamic-plugin-sdk';
import type {
  ResourceClusterNavItem,
  ResourceListPage,
  // RoutePage,
} from '@openshift-console/dynamic-plugin-sdk';

import { NodeNetworkStateModelGroupVersionKind } from '../../console-models';

export const StateExposedModules = {
  StatesList: './views/states/list/StatesList',
  // Topology: './views/states/topology/Topology',
};

export const StateExtensions: EncodedExtension[] = [
  {
    type: 'console.navigation/resource-cluster',
    properties: {
      id: 'state',
      perspective: 'admin',
      name: '%plugin__nmstate-console-plugin~NodeNetworkState%',
      section: 'networking',
      model: NodeNetworkStateModelGroupVersionKind,
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
      model: NodeNetworkStateModelGroupVersionKind,
      component: { $codeRef: 'StatesList' },
    },
  } as EncodedExtension<ResourceListPage>,
  // {
  //   type: 'console.page/route',
  //   properties: {
  //     path: ['nmstate-topology'],
  //     component: {
  //       $codeRef: 'Topology',
  //     },
  //   },
  // } as EncodedExtension<RoutePage>,
];
