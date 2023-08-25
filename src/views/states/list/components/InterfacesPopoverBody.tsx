import React, { FC, useCallback } from 'react';

import {
  Button,
  ButtonVariant,
  Checkbox,
  Flex,
  FlexItem,
  List,
  ListItem,
  Tooltip,
} from '@patternfly/react-core';
import { LongArrowAltDownIcon, LongArrowAltUpIcon } from '@patternfly/react-icons';
import { NodeNetworkConfigurationInterface, V1beta1NodeNetworkState } from '@types';
import { useNMStateTranslation } from '@utils/hooks/useNMStateTranslation';
import { getPorts } from '@utils/interfaces/getters';

import useDrawerInterface from '../hooks/useDrawerInterface';

import './interfaces-popover-body.scss';

type InterfacesPopoverBodyProps = {
  interfaces: NodeNetworkConfigurationInterface[];
  nodeNetworkState: V1beta1NodeNetworkState;
  hide: () => void;
};

const Row = ({ children }) => <Flex flexWrap={{ default: 'nowrap' }}>{children}</Flex>;
const FirstColumn = ({ children }) => <FlexItem flex={{ default: 'flex_1' }}>{children}</FlexItem>;
const SecondColumn = ({ children }) => <FlexItem flex={{ default: 'flex_3' }}>{children}</FlexItem>;

const InterfacesPopoverBody: FC<InterfacesPopoverBodyProps> = ({
  interfaces,
  nodeNetworkState,
  hide,
}) => {
  const { t } = useNMStateTranslation();
  const { setSelectedInterfaceName } = useDrawerInterface();

  const onInterfaceNameClick = useCallback(
    (iface: NodeNetworkConfigurationInterface) => {
      setSelectedInterfaceName(nodeNetworkState, iface);
      hide();
    },
    [hide],
  );

  return (
    <List isPlain className="interfaces-popover-body" isBordered>
      {interfaces.map((iface) => {
        const address = iface.ipv4?.address || iface.ipv6?.address;
        const ports = getPorts(iface);
        const Icon = iface.state.toLowerCase() === 'up' ? LongArrowAltUpIcon : LongArrowAltDownIcon;

        return (
          <ListItem key={iface.name} className="interfaces-popover-body__list-item">
            <Row>
              <FirstColumn>
                <strong>{t('Name')}</strong>
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
                <strong>{t('IP address')}</strong>
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
                <strong>{t('Ports')}</strong>
              </FirstColumn>
              <SecondColumn>
                {ports?.length ? (
                  <Tooltip
                    content={
                      <List isPlain>
                        {ports.map((port) => (
                          <ListItem key={port}>{port}</ListItem>
                        ))}
                      </List>
                    }
                  >
                    <span>{ports.length}</span>
                  </Tooltip>
                ) : (
                  '-'
                )}
              </SecondColumn>
            </Row>
            <Row>
              <FirstColumn>
                <strong>{t('LLDP')}</strong>
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
                <strong>{t('MTU')}</strong>
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
