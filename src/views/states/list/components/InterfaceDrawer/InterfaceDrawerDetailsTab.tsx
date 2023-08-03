import React, { FC } from 'react';

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
import { useNMStateTranslation } from '@utils/hooks/useNMStateTranslation';
import { getPorts } from '@utils/interfaces/getters';
import { getSystemName } from '@utils/neighbors/getters';

import NeighborInformations from './NeighborInformations';

type InterfaceDrawerDetailsTabProps = {
  selectedInterface: NodeNetworkConfigurationInterface;
};

const InterfaceDrawerDetailsTab: FC<InterfaceDrawerDetailsTabProps> = ({ selectedInterface }) => {
  const { t } = useNMStateTranslation();
  const ports = getPorts(selectedInterface);

  return (
    <Stack hasGutter>
      {selectedInterface.vlan && (
        <StackItem data-test="vlan-section">
          <Title headingLevel="h4">{t('VLAN details')}</Title>

          <Flex>
            <FlexItem>
              <strong>{t('Id')}:</strong>
            </FlexItem>
            <FlexItem>{selectedInterface.vlan.id}</FlexItem>
          </Flex>
          <Flex>
            <FlexItem>
              <strong>{t('Base interface')}:</strong>
            </FlexItem>
            <FlexItem>{selectedInterface.vlan['base-iface']}</FlexItem>
          </Flex>
        </StackItem>
      )}

      <StackItem data-test="lldp-section">
        <Title headingLevel="h4">{t('LLDP')}</Title>
        <p className="pf-u-mb-md">
          {selectedInterface.lldp?.enabled ? t('Enabled') : t('Disabled')}
        </p>
        {selectedInterface.lldp?.neighbors?.length > 0 && (
          <>
            <Title headingLevel="h4">{t('Neighbors')}</Title>
            <List isPlain isBordered>
              {selectedInterface.lldp?.neighbors?.map((neighbor) => (
                <ListItem key={getSystemName(neighbor)}>
                  <NeighborInformations neighbor={neighbor} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </StackItem>

      {selectedInterface.bridge?.port?.length > 0 && (
        <StackItem>
          <Title headingLevel="h4">{t('Ports')}</Title>
          <List isPlain>
            {ports?.map((port) => (
              <ListItem key={port}>{port}</ListItem>
            ))}
          </List>
        </StackItem>
      )}

      {selectedInterface['mac-address'] && (
        <StackItem>
          <Title headingLevel="h4">{t('MAC Address')}</Title>
          <p>{selectedInterface['mac-address']}</p>
        </StackItem>
      )}

      {selectedInterface.ethtool?.feature && (
        <StackItem>
          <Title headingLevel="h4">{t('Features')}</Title>
          <List isPlain>
            {Object.keys(selectedInterface.ethtool?.feature)
              .sort((a, b) => (a > b ? 1 : -1))
              ?.map((feature) => (
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
        </StackItem>
      )}
    </Stack>
  );
};

export default InterfaceDrawerDetailsTab;
