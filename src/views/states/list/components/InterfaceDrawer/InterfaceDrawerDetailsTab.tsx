import React, { FC } from 'react';

import { Checkbox, Flex, FlexItem, List, ListItem, Title } from '@patternfly/react-core';
import { NodeNetworkConfigurationInterface } from '@types';
import { t } from '@utils/hooks/useNMStateTranslation';
import { getSystemName } from '@utils/neighbors/getters';

import NeighborInformations from './NeighborInformations';

type InterfaceDrawerDetailsTabProps = {
  selectedInterface: NodeNetworkConfigurationInterface;
};

const InterfaceDrawerDetailsTab: FC<InterfaceDrawerDetailsTabProps> = ({ selectedInterface }) => {
  const ports = selectedInterface.bridge?.port?.map((port) => port.name);

  return (
    <div>
      {selectedInterface.ethtool?.feature && (
        <div className="pf-u-mb-md">
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
        </div>
      )}
      <div className="pf-u-mb-md" data-test="lldp-section">
        <Title headingLevel="h4">LLDP</Title>
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
          <Title headingLevel="h4">{t('MAC Address')}</Title>
          <p>{selectedInterface['mac-address']}</p>
        </div>
      )}
    </div>
  );
};

export default InterfaceDrawerDetailsTab;
