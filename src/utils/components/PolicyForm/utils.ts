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

  return t('Policy interface');
};

export const validateInterfaceName = (name: string): string => {
  if (!name) return '';

  if (name.length > 15) {
    // t('Interface name should follow the linux kernel naming convention. The name should be smaller than 16 characters.')
    return 'Interface name should follow the linux kernel naming convention. The name should be smaller than 16 characters.';
  }

  if (/[/ ]/.test(name)) {
    // t('Interface name should follow the linux kernel naming convention. Whitespaces and slashes are not allowed.')
    return 'Interface name should follow the linux kernel naming convention. Whitespaces and slashes are not allowed.';
  }
  return '';
};

export function capitalizeFirstLetter(string: string) {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
}
