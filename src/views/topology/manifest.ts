import type { EncodedExtension } from '@openshift/dynamic-plugin-sdk';
import type { HrefNavItem, RoutePage } from '@openshift-console/dynamic-plugin-sdk';

export const TopologyExposedModules = {
  Topology: './views/topology/Topology',
};

export const TopologyExtensions: EncodedExtension[] = [
  {
    type: 'console.navigation/href',
    properties: {
      id: 'topology',
      perspective: 'admin',
      href: 'nmstate-topology',
      section: 'networking',
      name: '%plugin__nmstate-console-plugin~Topology%',
      dataAttributes: {
        'data-quickstart-id': 'qs-nav-topology',
        'data-test-id': 'state-nav-topology',
      },
      insertAfter: 'state',
    },
  } as EncodedExtension<HrefNavItem>,
  {
    type: 'console.page/route',
    properties: {
      path: ['nmstate-topology'],
      component: {
        $codeRef: 'Topology',
      },
    },
  } as EncodedExtension<RoutePage>,
];
