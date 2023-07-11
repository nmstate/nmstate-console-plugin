import React, { FC, useCallback } from 'react';
import { useHistory } from 'react-router';
import NodeNetworkStateModel from 'src/console-models/NodeNetworkStateModel';

import {
  Button,
  ButtonVariant,
  Checkbox,
  Flex,
  FlexItem,
  List,
  ListItem,
} from '@patternfly/react-core';
import { LongArrowAltDownIcon, LongArrowAltUpIcon } from '@patternfly/react-icons';
import { NodeNetworkConfigurationInterface } from '@types';
import { getResourceUrl } from '@utils/helpers';

import './interfaces-popover-body.scss';

type InterfacesPopoverBodyProps = {
  interfaces: NodeNetworkConfigurationInterface[];
  hide: () => void;
};

const Row = ({ children }) => <Flex flexWrap={{ default: 'nowrap' }}>{children}</Flex>;
const FirstColumn = ({ children }) => <FlexItem flex={{ default: 'flex_1' }}>{children}</FlexItem>;
const SecondColumn = ({ children }) => <FlexItem flex={{ default: 'flex_3' }}>{children}</FlexItem>;

const InterfacesPopoverBody: FC<InterfacesPopoverBodyProps> = ({ interfaces, hide }) => {
  const history = useHistory();

  const onInterfaceNameClick = useCallback(
    (iface: NodeNetworkConfigurationInterface) => {
      const baseListUrl = getResourceUrl({ model: NodeNetworkStateModel });

      const query = new URLSearchParams({
        selectedInterface: iface.name,
      });

      history.push(`${baseListUrl}?${query.toString()}`);

      hide();
    },
    [hide],
  );

  return (
    <List isPlain className="interfaces-popover-body" isBordered>
      {interfaces.map((iface) => {
        const address = iface.ipv4?.address || iface.ipv6?.address;
        const Icon = iface.state.toLowerCase() === 'up' ? LongArrowAltUpIcon : LongArrowAltDownIcon;

        return (
          <ListItem key={iface.name} className="interfaces-popover-body__list-item">
            <Row>
              <FirstColumn>
                <strong>Name</strong>
              </FirstColumn>
              <SecondColumn>
                <Button
                  variant={ButtonVariant.link}
                  onClick={() => onInterfaceNameClick(iface)}
                  className="interface-button-name"
                >
                  {iface.name} <Icon color="black" className="pf-u-mr-sm" />
                </Button>
              </SecondColumn>
            </Row>
            <Row>
              <FirstColumn>
                <strong>IP address</strong>
              </FirstColumn>
              <SecondColumn>
                {address?.[0] ? (
                  <>
                    {address?.[0]?.ip}/{address?.[0]?.['prefix-length']}
                  </>
                ) : (
                  '-'
                )}
              </SecondColumn>
            </Row>
            <Row>
              <FirstColumn>
                <strong>Ports</strong>
              </FirstColumn>
              <SecondColumn>{iface.bridge?.port?.length || '-'}</SecondColumn>
            </Row>
            <Row>
              <FirstColumn>
                <strong>LLDP</strong>
              </FirstColumn>
              <SecondColumn>
                <Checkbox
                  id={`lldp-enabled-${iface.name}`}
                  isDisabled
                  isChecked={iface.lldp?.enabled}
                />
              </SecondColumn>
            </Row>

            <Row>
              <FirstColumn>
                <strong>MTU</strong>
              </FirstColumn>
              <SecondColumn>{iface?.mtu || '-'}</SecondColumn>
            </Row>
          </ListItem>
        );
      })}
    </List>
  );
};

export default InterfacesPopoverBody;
