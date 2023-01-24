import { NodeNetworkConfigurationEnactmentModelGroupVersionKind } from 'src/console-models/NodeNetworkConfigurationEnactmentModel';
import { ENACTMENT_LABEL_POLICY } from 'src/utils/constants';

import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { V1beta1NodeNetworkConfigurationEnactment } from '@types';

export const usePolicyEnactments = (policyName: string) => {
  return useK8sWatchResource<V1beta1NodeNetworkConfigurationEnactment[]>({
    groupVersionKind: NodeNetworkConfigurationEnactmentModelGroupVersionKind,
    isList: true,
    selector: {
      matchLabels: {
        [ENACTMENT_LABEL_POLICY]: policyName,
      },
    },
  });
};
