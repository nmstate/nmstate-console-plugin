import React, { FC } from 'react';

import { Checkbox, Flex, FlexItem, List, ListItem, Title } from '@patternfly/react-core';
import { NodeNetworkConfigurationInterface } from '@types';

type InterfaceDrawerDetailsTabProps = {
  selectedInterface: NodeNetworkConfigurationInterface;
};

const InterfaceDrawerDetailsTab: FC<InterfaceDrawerDetailsTabProps> = ({ selectedInterface }) => {
  const ports = selectedInterface.bridge?.port?.map((port) => port.name);

  return (
    <div>
      {selectedInterface.ethtool?.feature && (
        <div className="pf-u-mb-md">
          <Title headingLevel="h4">Features</Title>
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
      {selectedInterface.bridge?.port?.length > 0 && (
        <div className="pf-u-mb-md">
          <Title headingLevel="h4">Ports</Title>
          <List isPlain>
            {ports?.map((port) => (
              <ListItem key={port}>{port}</ListItem>
            ))}
          </List>
        </div>
      )}

      {selectedInterface['mac-address'] && (
        <div className="pf-u-mb-md">
          <Title headingLevel="h4">Mac Address</Title>
          <p>{selectedInterface['mac-address']}</p>
        </div>
      )}
    </div>
  );
};

export default InterfaceDrawerDetailsTab;
