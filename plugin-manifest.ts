import type { EncodedExtension } from '@openshift/dynamic-plugin-sdk';
import type {
  ExtensionK8sModel,
  ResourceClusterNavItem,
  ResourceDetailsPage,
  ResourceListPage,
  RoutePage,
  YAMLTemplate,
} from '@openshift-console/dynamic-plugin-sdk';
import type { ConsolePluginMetadata } from '@openshift-console/dynamic-plugin-sdk-webpack/lib/schema/plugin-package';

import NodeNetworkConfigurationPolicyModel from './src/console-models/NodeNetworkConfigurationPolicyModel';

export const pluginMetadata = {
  name: 'nmstate-console-plugin',
  version: '0.0.1',
  displayName: 'OpenShift Console Plugin For NMState',
  description:
    'NMState  is a library that manages host netowrking settings in a declarative manner.',
  exposedModules: {
    PoliciesList: './policies/list/PoliciesList',
    NewPolicy: './policies/new/NewPolicy',
    PolicyTemplate: 'src/policy-template.ts',
    PolicyPage: './policies/details/PolicyPage',
  },
  dependencies: {
    '@console/pluginAPI': '*',
  },
} as ConsolePluginMetadata;

const PolicyExtensionModel: ExtensionK8sModel = {
  group: NodeNetworkConfigurationPolicyModel.apiGroup as string,
  kind: NodeNetworkConfigurationPolicyModel.kind,
  version: NodeNetworkConfigurationPolicyModel.apiVersion,
};

export const extensions: EncodedExtension[] = [
  {
    type: 'console.navigation/resource-cluster',
    properties: {
      id: 'policy',
      perspective: 'admin',
      name: '%plugin__nmstate-console-plugin~NodeNetworkConfigurationPolicy%',
      section: 'networking',
      model: PolicyExtensionModel,
      dataAttributes: {
        'data-quickstart-id': 'qs-nav-policy-list',
        'data-test-id': 'policy-nav-list',
      },
    },
  } as EncodedExtension<ResourceClusterNavItem>,
  {
    type: 'console.page/resource/list',
    properties: {
      perspective: 'admin',
      model: PolicyExtensionModel,
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
        'data-quickstart-id': 'qs-nav-sec-policy',
        'data-test-id': 'policy-nav-item',
      },
      component: {
        $codeRef: 'NewPolicy',
      },
    },
  } as EncodedExtension<RoutePage>,
  {
    type: 'console.yaml-template',
    properties: {
      name: 'default',
      model: PolicyExtensionModel,
      template: {
        $codeRef: 'PolicyTemplate.defaultPolicyTemplate',
      },
    },
  } as EncodedExtension<YAMLTemplate>,

  {
    type: 'console.page/resource/details',
    properties: {
      model: PolicyExtensionModel,
      component: { $codeRef: 'PolicyPage' },
    },
  } as EncodedExtension<ResourceDetailsPage>,
];
