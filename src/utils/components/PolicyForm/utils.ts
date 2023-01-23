import { TFunction } from 'react-i18next';

import { NodeNetworkConfigurationInterface } from '@types';

import { INTERFACE_TYPE_OPTIONS } from './constants';

export const getExpandableTitle = (
  nncpInterface: NodeNetworkConfigurationInterface,
  t: TFunction,
): string => {
  if (nncpInterface && nncpInterface.type && nncpInterface.name)
    return `${INTERFACE_TYPE_OPTIONS[nncpInterface.type] || nncpInterface.type} ${
      nncpInterface.name
    }`;

  return t('Node network configuration policy interface');
};
