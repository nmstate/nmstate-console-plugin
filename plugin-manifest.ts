import type { EncodedExtension } from '@openshift/dynamic-plugin-sdk';
import type {
  ExtensionK8sModel,
  ResourceClusterNavItem,
  ResourceListPage,
  RoutePage,
} from '@openshift-console/dynamic-plugin-sdk';
import type { ConsolePluginMetadata } from '@openshift-console/dynamic-plugin-sdk-webpack/lib/schema/plugin-package';

export const pluginMetadata = {
  name: 'nmstate-console-plugin',
  version: '0.0.1',
  displayName: 'OpenShift Console Plugin For NMState',
  description:
    'NMState  is a library that manages host netowrking settings in a declarative manner.',
  exposedModules: {
    PoliciesList: './policies/list/PoliciesList',
    NewPolicy: './policies/new/NewPolicy',
  },
  dependencies: {
    '@console/pluginAPI': '*',
  },
} as ConsolePluginMetadata;

const NodeNetworkConfigurationPolicyModel: ExtensionK8sModel = {
  group: 'nmstate.io',
  kind: 'NodeNetworkConfigurationPolicy',
  version: 'v1',
};

export const extensions: EncodedExtension[] = [
  {
    type: 'console.navigation/resource-cluster',
    properties: {
      id: 'policy',
      perspective: 'admin',
      name: '%plugin__nmstate-plugin~NodeNetworkConfigurationPolicy%',
      section: 'networking',
      model: NodeNetworkConfigurationPolicyModel,
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
      model: NodeNetworkConfigurationPolicyModel,
      component: { $codeRef: 'PoliciesList' },
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
        $codeRef: 'NewPolicy',
      },
    },
  } as EncodedExtension<RoutePage>,
];
