import { V1beta1NodeNetworkConfigurationEnactment } from '@types';

export const findConditionType = (conditions: any, conditionType: string) =>
  conditions?.find(
    (condition: { type: string; status: string }) =>
      condition?.type === conditionType && condition?.status === 'True',
  );

export const categorizeEnactments = (enactments: V1beta1NodeNetworkConfigurationEnactment[]) => {
  return (enactments || []).reduce(
    (acc, enactment) => {
      if (findConditionType(enactment?.status?.conditions, 'Available'))
        acc.availableEnactments.push(enactment);

      if (findConditionType(enactment?.status?.conditions, 'Pending'))
        acc.pendingEnactments.push(enactment);

      if (findConditionType(enactment?.status?.conditions, 'Failing'))
        acc.failingEnactments.push(enactment);

      if (findConditionType(enactment?.status?.conditions, 'Progressing'))
        acc.progressingEnactments.push(enactment);

      if (findConditionType(enactment?.status?.conditions, 'Aborted'))
        acc.abortedEnactments.push(enactment);

      return acc;
    },
    {
      availableEnactments: [],
      pendingEnactments: [],
      failingEnactments: [],
      progressingEnactments: [],
      abortedEnactments: [],
    } as { [key in string]: V1beta1NodeNetworkConfigurationEnactment[] },
  );
};
