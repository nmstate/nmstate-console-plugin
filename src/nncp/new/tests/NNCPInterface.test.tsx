import * as React from 'react';

import { cleanup, render } from '@testing-library/react';
import { InterfaceType, NodeNetworkConfigurationInterface } from '@types';

import { NETWORK_STATES } from '../components/constants';
import NNCPInterface from '../components/NNCPInterface';

afterEach(cleanup);

const nncpInterface: NodeNetworkConfigurationInterface = {
  name: 'br0',
  type: InterfaceType.LINUX_BRIDGE,
  state: NETWORK_STATES.Up,
};

const onInterfaceChange = jest.fn();

test('NNCPInterface', async () => {
  const { getByLabelText } = render(
    <NNCPInterface id={1} nncpInterface={nncpInterface} onInterfaceChange={onInterfaceChange} />,
  );

  expect((getByLabelText('Interface name', { exact: false }) as HTMLInputElement).value).toBe(
    nncpInterface.name,
  );
});
