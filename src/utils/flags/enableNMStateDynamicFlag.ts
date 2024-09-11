import { SetFeatureFlag } from '@openshift-console/dynamic-plugin-sdk';

import { FLAG_NMSTATE_DYNAMIC } from './consts';

export const enableNMStateDynamicFlag = (setFeatureFlag: SetFeatureFlag) =>
  setFeatureFlag(FLAG_NMSTATE_DYNAMIC, true);
