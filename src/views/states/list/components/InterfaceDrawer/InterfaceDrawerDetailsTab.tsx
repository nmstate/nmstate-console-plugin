import React, { FC } from 'react';
import {
  CHASSIS_ID,
  IEE_802_1_VLANS,
  PORT_ID,
  SYSTEM_DESCRIPTION,
  SYSTEM_NAME,
} from 'src/nmstate-types/custom-models/NodeNetworkConfigurationInterfaceLLDP';

import {
  Checkbox,
  Flex,
  FlexItem,
  List,
  ListItem,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import { NodeNetworkConfigurationInterface } from '@types';
import { t } from '@utils/hooks/useNMStateTranslation';

type InterfaceDrawerDetailsTabProps = {
  selectedInterface: NodeNetworkConfigurationInterface;
};

const NEIGHBOR_INTERESTING_PROPERTIES = [
  CHASSIS_ID,
  PORT_ID,
  SYSTEM_NAME,
  SYSTEM_DESCRIPTION,
  '_description',
  IEE_802_1_VLANS,
];

const InterfaceDrawerDetailsTab: FC<InterfaceDrawerDetailsTabProps> = ({ selectedInterface }) => {
  const ports = selectedInterface.bridge?.port?.map((port) => port.name);

  const neighborsToShow = selectedInterface.lldp?.neighbors?.filter((neighbor) =>
    Object.keys(neighbor).some((key) => NEIGHBOR_INTERESTING_PROPERTIES.includes(key)),
  );

  return (
    <div>
      {selectedInterface.ethtool?.feature && (
        <div className="pf-u-mb-md">
          <Title headingLevel="h4">{t('Features')}</Title>
          <List isPlain>
            {Object.keys(selectedInterface.ethtool?.feature)?.map((feature) => (
              <ListItem key={feature}>
                <Flex>
                  <FlexItem>
                    <Checkbox
                      isDisabled
                      id={`checkbox-${feature}`}
                      value={feature}
                      isChecked={selectedInterface.ethtool?.feature?.[feature]}
                    />
                  </FlexItem>

                  <FlexItem>{feature}</FlexItem>
                </Flex>
              </ListItem>
            ))}
          </List>
        </div>
      )}
      <div className="pf-u-mb-md">
        <Title headingLevel="h4">LLDP</Title>
        <p className="pf-u-mb-md">
          {selectedInterface.lldp?.enabled ? t('Enabled') : t('Disabled')}
        </p>
        <List isPlain isBordered>
          {neighborsToShow?.map((neighbor) => (
            <ListItem key={neighbor.type}>
              <Stack>
                {neighbor[CHASSIS_ID] && (
                  <StackItem>
                    <strong>{t('Chassis ID')}</strong>: {neighbor[CHASSIS_ID]}
                  </StackItem>
                )}

                {neighbor[PORT_ID] && (
                  <StackItem>
                    <strong>{t('Port')}</strong>: {neighbor[PORT_ID]}
                  </StackItem>
                )}
                {neighbor._description && (
                  <StackItem>
                    <strong>{t('Description')}</strong>: {neighbor._description}
                  </StackItem>
                )}
                {neighbor[SYSTEM_NAME] && (
                  <StackItem>
                    <strong>{t('System Name')}</strong>: {neighbor[SYSTEM_NAME]}
                  </StackItem>
                )}
                {neighbor[SYSTEM_DESCRIPTION] && (
                  <StackItem>
                    <strong>{t('System Description')}</strong>: {neighbor[SYSTEM_DESCRIPTION]}
                  </StackItem>
                )}
                {neighbor[IEE_802_1_VLANS] && (
                  <StackItem>
                    <strong>{t('VID')}</strong>:{' '}
                    {neighbor[IEE_802_1_VLANS]?.map((vlan) => vlan.vid)?.join(', ')}
                  </StackItem>
                )}
              </Stack>
            </ListItem>
          ))}
        </List>
      </div>

      {selectedInterface.bridge?.port?.length > 0 && (
        <div className="pf-u-mb-md">
          <Title headingLevel="h4">{t('Ports')}</Title>
          <List isPlain>
            {ports?.map((port) => (
              <ListItem key={port}>{port}</ListItem>
            ))}
          </List>
        </div>
      )}

      {selectedInterface['mac-address'] && (
        <div className="pf-u-mb-md">
          <Title headingLevel="h4">{t('Mac Address')}</Title>
          <p>{selectedInterface['mac-address']}</p>
        </div>
      )}
    </div>
  );
};

export default InterfaceDrawerDetailsTab;
