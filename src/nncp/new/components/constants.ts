import { InterfaceType } from '@types';

export enum NETWORK_STATES {
  Up = 'up',
  Down = 'down',
}

export const INTERFACE_TYPE_OPTIONS = {
  [InterfaceType.LINUX_BRIDGE]: 'Bridge',
  [InterfaceType.BOND]: 'Bonding',
  [InterfaceType.ETHERNET]: 'Ethernet',
};
