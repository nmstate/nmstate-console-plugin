import type { ConsolePluginMetadata } from '@openshift-console/dynamic-plugin-sdk-webpack/lib/schema/plugin-package';

export default {
  name: 'nmstate-console-plugin',
  version: '0.0.1',
  displayName: 'OpenShift Console Plugin For NMState',
  description:
    'NMState  is a libraary that manages host netowrking settings in a declarative manner.',
  exposedModules: {
    NNCPList: './nncp/list/NNCPList',
    NNCPNew: './nncp/new/NNCPNew',
  },
  dependencies: {
    '@console/pluginAPI': '*',
  },
} as ConsolePluginMetadata;
