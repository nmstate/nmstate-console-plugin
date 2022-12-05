import type { EncodedExtension } from '@openshift/dynamic-plugin-sdk';
import type {
  ResourceClusterNavItem,
  ResourceListPage,
  RoutePage,
} from '@openshift-console/dynamic-plugin-sdk';

const extensions: EncodedExtension[] = [
  {
    type: 'console.navigation/resource-cluster',
    properties: {
      id: 'nncp',
      perspective: 'admin',
      name: '%plugin__nmstate-plugin~NodeNetworkConfigurationPolicy%',
      section: 'networking',
      model: {
        group: 'nmstate.io',
        kind: 'NodeNetworkConfigurationPolicy',
        version: 'v1',
      },
      dataAttributes: {
        'data-quickstart-id': 'qs-nav-nncp-list',
        'data-test-id': 'nncp-nav-list',
      },
    },
  } as EncodedExtension<ResourceClusterNavItem>,
  {
    type: 'console.page/resource/list',
    properties: {
      perspective: 'admin',
      model: {
        group: 'nmstate.io',
        kind: 'NodeNetworkConfigurationPolicy',
        version: 'v1',
      },
      component: { $codeRef: 'NNCPList' },
    },
  } as EncodedExtension<ResourceListPage>,

  {
    type: 'console.page/route',
    properties: {
      path: [
        '/k8s/cluster/nmstate.io~v1~NodeNetworkConfigurationPolicy/~new/form',
        '/k8s/cluster/nmstate.io~v1~NodeNetworkConfigurationPolicy/~new/yaml',
      ],
      perspective: 'admin',
      id: 'networking',
      name: '%plugin__nmstate-console-plugin~NodeNetworkConfigurationPolicy%',
      dataAttributes: {
        'data-quickstart-id': 'qs-nav-sec-nncp',
        'data-test-id': 'nncp-nav-item',
      },
      component: {
        $codeRef: 'NNCPNew',
      },
    },
  } as EncodedExtension<RoutePage>,
];

export default extensions;
