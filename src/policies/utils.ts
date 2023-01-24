import {
  InterfaceType,
  NodeNetworkConfigurationInterface,
  V1beta1NodeNetworkConfigurationEnactment,
  V1NodeNetworkConfigurationPolicy,
} from '@types';

export const isPolicySupported = (policy: V1NodeNetworkConfigurationPolicy) => {
  return policy?.spec?.desiredState?.interfaces.find(
    (policyInterface: NodeNetworkConfigurationInterface) =>
      [InterfaceType.BOND, InterfaceType.ETHERNET, InterfaceType.LINUX_BRIDGE].includes(
        policyInterface.type,
      ),
  );
};

export const areAllEnactmentsAbsent = (
  policyEnactments: V1beta1NodeNetworkConfigurationEnactment[],
) => {
  return policyEnactments?.every((policyEnactment) =>
    policyEnactment?.status?.desiredState?.interfaces?.every((policyInterface) =>
      ['absent' || 'ABSENT'].includes(policyInterface?.state),
    ),
  );
};

export const areAllEnactmentsAvailable = (
  policyEnactments: V1beta1NodeNetworkConfigurationEnactment[],
) => {
  return policyEnactments?.every((policyEnactment) =>
    policyEnactment?.status?.conditions?.find(
      (condition) => condition?.type === 'Available' && condition?.status === 'True',
    ),
  );
};
