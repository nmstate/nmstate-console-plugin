import type { EncodedExtension } from '@openshift/dynamic-plugin-sdk';
import type { ConsolePluginMetadata } from '@openshift-console/dynamic-plugin-sdk-webpack/lib/schema/plugin-package';

import { PolicyExposedModules, PolicyExtensions } from './src/views/policies/manifest';
import { StateExposedModules, StateExtensions } from './src/views/states/manifest';

export const pluginMetadata = {
  name: 'nmstate-console-plugin',
  version: '0.0.1',
  displayName: 'OpenShift Console Plugin For NMState',
  description:
    'NMState  is a library that manages host networking settings in a declarative manner.',
  exposedModules: {
    ...PolicyExposedModules,
    ...StateExposedModules,
  },
  dependencies: {
    '@console/pluginAPI': '*',
  },
} as ConsolePluginMetadata;

export const extensions: EncodedExtension[] = [...PolicyExtensions, ...StateExtensions];
