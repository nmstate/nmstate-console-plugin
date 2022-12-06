import { InterfaceType } from 'nmstate-ts';

export enum NETWORK_STATES {
  Up = 'UP',
  Down = 'DOWN',
}

export const INTERFACE_TYPE_OPTIONS = {
  [InterfaceType.LINUX_BRIDGE]: 'Bridge',
  [InterfaceType.BOND]: 'Bonding',
  [InterfaceType.ETHERNET]: 'Ethernet',
};
