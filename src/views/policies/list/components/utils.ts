import { V1beta1NodeNetworkConfigurationEnactment } from '@types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const findConditionType = (conditions: any, conditionType: string) =>
  conditions?.find(
    (condition: { type: string; status: string }) =>
      condition?.type === conditionType && condition?.status === 'True',
  );

export const getEnactmentStatus = (enactment: V1beta1NodeNetworkConfigurationEnactment): string =>
  enactment?.status?.conditions?.find((condition) => condition.status === 'True').type;

export const categorizeEnactments = (enactments: V1beta1NodeNetworkConfigurationEnactment[]) => {
  return (enactments || []).reduce(
    (acc, enactment) => {
      const status = getEnactmentStatus(enactment);

      if (acc[status?.toLowerCase()]) acc[status?.toLowerCase()].push(enactment);
      return acc;
    },
    {
      available: [],
      pending: [],
      failing: [],
      progressing: [],
      aborted: [],
    } as { [key in string]: V1beta1NodeNetworkConfigurationEnactment[] },
  );
};
