import React, { FC } from 'react';
import {
  CHASSIS_ID,
  NodeNetworkConfigurationInterfaceLLDPNeighbor,
} from 'src/nmstate-types/custom-models/NodeNetworkConfigurationInterfaceLLDP';

import { Stack, StackItem, Tooltip } from '@patternfly/react-core';
import { useNMStateTranslation } from '@utils/hooks/useNMStateTranslation';
import {
  getChassisId,
  getDescription,
  getIee8021Vlans,
  getPortId,
  getSystemDescription,
  getSystemName,
} from '@utils/neighbors/getters';

const NeighborInformations: FC<{ neighbor: NodeNetworkConfigurationInterfaceLLDPNeighbor }> = ({
  neighbor,
}) => {
  const { t } = useNMStateTranslation();

  const chassisIdDescription = getDescription(neighbor, CHASSIS_ID);
  const portId = getPortId(neighbor);
  const chassisId = getChassisId(neighbor);
  const systemName = getSystemName(neighbor);
  const systemDescription = getSystemDescription(neighbor);
  const iee8021Vlans = getIee8021Vlans(neighbor).sort((a, b) => a.vid - b.vid);

  return (
    <Stack>
      {chassisId && (
        <StackItem>
          <strong>{chassisIdDescription}</strong>: {chassisId}
        </StackItem>
      )}

      {portId && (
        <StackItem>
          <strong>{t('Port')}</strong>: {portId}
        </StackItem>
      )}
      {systemName && (
        <StackItem>
          <strong>{t('System Name')}</strong>: {systemName}
        </StackItem>
      )}
      {systemDescription && (
        <StackItem>
          <strong>{t('System Description')}</strong>: {systemDescription}
        </StackItem>
      )}
      {iee8021Vlans && (
        <StackItem>
          <strong>{t('VLANS')}</strong>:{' '}
          {iee8021Vlans?.map((vlan, index) => (
            <>
              <Tooltip content={vlan.name} key={vlan.vid}>
                <span>{vlan.vid}</span>
              </Tooltip>
              {index !== iee8021Vlans.length - 1 ? ', ' : ''}
            </>
          ))}
        </StackItem>
      )}
    </Stack>
  );
};

export default NeighborInformations;
