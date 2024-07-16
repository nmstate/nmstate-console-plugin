import { TFunction } from 'react-i18next';

import {
  InterfaceType,
  NodeNetworkConfigurationInterface,
  V1NodeNetworkConfigurationPolicy,
} from '@types';
import { t } from '@utils/hooks/useNMStateTranslation';

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

export const isOVSBridgeExisting = (policy: V1NodeNetworkConfigurationPolicy): boolean =>
  policy?.spec?.desiredState?.interfaces?.some(
    (iface: NodeNetworkConfigurationInterface) => iface?.type === InterfaceType.OVS_BRIDGE,
  );

export const validateInterfaceName = (name: string): string => {
  if (!name) return '';

  if (name.length > 15) {
    // t('Interface name should follow the linux kernel naming convention. The name should be smaller than 16 characters.')
    return t(
      'Interface name should follow the linux kernel naming convention. The name should be smaller than 16 characters.',
    );
  }

  if (/[/ ]/.test(name)) {
    // t('Interface name should follow the linux kernel naming convention. Whitespaces and slashes are not allowed.')
    return t(
      'Interface name should follow the linux kernel naming convention. Whitespaces and slashes are not allowed.',
    );
  }
  return '';
};

export function capitalizeFirstLetter(string: string) {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
}
