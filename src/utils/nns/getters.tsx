import { NodeNetworkConfigurationInterface, V1beta1NodeNetworkState } from '@types';

export const getInterfaces = (nns: V1beta1NodeNetworkState): NodeNetworkConfigurationInterface[] =>
  nns?.status?.currentState?.interfaces;
