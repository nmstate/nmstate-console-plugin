import type { EncodedExtension } from '@openshift/dynamic-plugin-sdk';
import { FeatureFlag } from '@openshift-console/dynamic-plugin-sdk';
import type { ConsolePluginBuildMetadata } from '@openshift-console/dynamic-plugin-sdk-webpack';

import { PolicyExposedModules, PolicyExtensions } from './src/views/policies/manifest';
import { StateExposedModules, StateExtensions } from './src/views/states/manifest';

export const pluginMetadata: ConsolePluginBuildMetadata = {
  name: 'nmstate-console-plugin',
  version: '0.0.1',
  displayName: 'OpenShift Console Plugin For NMState',
  description:
    'NMState  is a library that manages host networking settings in a declarative manner.',
  exposedModules: {
    ...PolicyExposedModules,
    ...StateExposedModules,
    nmstateFlags: './utils/flags',
  },
  dependencies: {
    '@console/pluginAPI': '*',
  },
};

export const extensions: EncodedExtension[] = [
  {
    properties: {
      handler: { $codeRef: 'nmstateFlags.enableNMStateDynamicFlag' },
    },
    type: 'console.flag',
  } as EncodedExtension<FeatureFlag>,
  ...PolicyExtensions,
  ...StateExtensions,
];
