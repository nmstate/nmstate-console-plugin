import React, { FC, useState } from 'react';
import { NodeNetworkConfigurationInterfaceBondMode } from 'src/nmstate-types/custom-models/NodeNetworkConfigurationInterfaceBondMode';
import { ensurePath } from 'src/utils/helpers';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import {
  Checkbox,
  FormGroup,
  Popover,
  Select,
  SelectOption,
  SelectVariant,
  Text,
  TextInput,
} from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import { InterfaceType, NodeNetworkConfigurationInterface } from '@types';

import { INTERFACE_TYPE_OPTIONS, NETWORK_STATES } from './constants';

import './nncp-interface.scss';

type NNCPInterfaceProps = {
  id: number;
  nncpInterface?: NodeNetworkConfigurationInterface;
  onInterfaceChange?: (
    interfaceId: number,
    updateInterface: (nncpInterface: NodeNetworkConfigurationInterface) => void,
  ) => void;
};

const NNCPInterface: FC<NNCPInterfaceProps> = ({ id, nncpInterface, onInterfaceChange }) => {
  const { t } = useNMStateTranslation();
  const [isStateOpen, setStateOpen] = useState(false);
  const [isTypeOpen, setTypeOpen] = useState(false);

  const handleStateChange = (
    event: React.MouseEvent<Element, MouseEvent>,
    newState: NETWORK_STATES,
  ) => {
    onInterfaceChange(id, (draftNNCPInterface) => (draftNNCPInterface.state = newState));
    setStateOpen(false);
  };

  const handleNameChange = (newName: string) => {
    onInterfaceChange(id, (draftNNCPInterface) => (draftNNCPInterface.name = newName));
  };

  const handleTypechange = (event: React.MouseEvent<Element, MouseEvent>, newType: string) => {
    onInterfaceChange(id, (draftNNCPInterface) => {
      draftNNCPInterface.type = newType as InterfaceType;

      if (newType === InterfaceType.LINUX_BRIDGE)
        draftNNCPInterface.bridge = { port: [], options: {} };

      if (newType === InterfaceType.BOND)
        draftNNCPInterface['link-aggregation'] = {
          mode: NodeNetworkConfigurationInterfaceBondMode.BALANCE_RR,
          port: [],
        };
    });
    setTypeOpen(false);
  };

  const onIP4Change = (checked: boolean) => {
    if (checked)
      onInterfaceChange(id, (draftNNCPInterface) => (draftNNCPInterface.ipv4 = { enabled: true }));
    else {
      onInterfaceChange(id, (draftNNCPInterface) => {
        delete draftNNCPInterface.ipv4;
      });
    }
  };

  const onDHCPChange = (checked: boolean) => {
    onInterfaceChange(id, (draftNNCPInterface) => (draftNNCPInterface.ipv4.dhcp = checked));
  };

  const onSTPChange = (checked: boolean) => {
    onInterfaceChange(id, (draftNNCPInterface) => {
      ensurePath(draftNNCPInterface, 'bridge.options');

      draftNNCPInterface.bridge = {
        options: {
          stp: { enabled: checked },
        },
      };
    });
  };

  const onPortChange = (value: string) => {
    onInterfaceChange(id, (draftNNCPInterface) => {
      if (draftNNCPInterface.type === InterfaceType.BOND) {
        ensurePath(draftNNCPInterface, 'link-aggregation.port');
        draftNNCPInterface['link-aggregation'].port = value.split(',');
      }

      if (draftNNCPInterface.type === InterfaceType.LINUX_BRIDGE) {
        ensurePath(draftNNCPInterface, 'bridge.port');
        draftNNCPInterface.bridge.port = [{ name: value }];
      }
    });
  };

  return (
    <>
      <FormGroup label={t('Interface name')} isRequired fieldId={`nncp-interface-name-${id}`}>
        <TextInput
          isRequired
          id={`nncp-interface-name-${id}`}
          name={`nncp-interface-name-${id}`}
          value={nncpInterface?.name}
          onChange={handleNameChange}
        />
      </FormGroup>
      <FormGroup
        label={t('Network state')}
        isRequired
        fieldId={`nncp-interface-network-state-${id}`}
      >
        <Select
          menuAppendTo="parent"
          id={`nncp-interface-network-state-${id}`}
          isOpen={isStateOpen}
          onToggle={setStateOpen}
          onSelect={handleStateChange}
          variant={SelectVariant.single}
          selections={nncpInterface?.state}
        >
          {Object.entries(NETWORK_STATES).map(([key, value]) => (
            <SelectOption key={key} value={value}>
              {key}
            </SelectOption>
          ))}
        </Select>
      </FormGroup>

      <FormGroup label={t('Type')} isRequired fieldId={`nncp-interface-type-${id}`}>
        <Select
          id={`nncp-interface-type-${id}`}
          menuAppendTo="parent"
          isOpen={isTypeOpen}
          onToggle={setTypeOpen}
          onSelect={handleTypechange}
          variant={SelectVariant.single}
          selections={nncpInterface?.type}
        >
          {Object.entries(INTERFACE_TYPE_OPTIONS).map(([key, value]) => (
            <SelectOption key={key} value={key}>
              {value}
            </SelectOption>
          ))}
        </Select>
      </FormGroup>
      <FormGroup label={t('IP configuration')} fieldId={`nncp-interface-ip-${id}`}>
        <Checkbox
          label={t('IPV4')}
          id={`nncp-interface-ip-${id}`}
          isChecked={!!nncpInterface.ipv4}
          onChange={onIP4Change}
        />
        {!!nncpInterface.ipv4 && (
          <Checkbox
            label={t('DHCP')}
            id={`nncp-interface-dhcp-${id}`}
            isChecked={nncpInterface.ipv4.dhcp}
            onChange={onDHCPChange}
          />
        )}
      </FormGroup>
      <FormGroup
        label={t('Port')}
        fieldId={`nncp-interface-port-${id}`}
        helperText={
          nncpInterface.type === InterfaceType.BOND && t('Use commas to separate between ports')
        }
      >
        <TextInput
          value={
            nncpInterface?.bridge?.port?.[0]?.name ||
            nncpInterface?.['link-aggregation']?.port.join(',')
          }
          type="text"
          id={`nncp-interface-port-${id}`}
          onChange={onPortChange}
        />
      </FormGroup>

      {nncpInterface.type === InterfaceType.LINUX_BRIDGE && (
        <FormGroup fieldId={`nncp-interface-stp-${id}`}>
          <Checkbox
            label={
              <Text>
                {t('Enable STP')}{' '}
                <Popover
                  aria-label={'Help'}
                  bodyContent={() => <div>{t('STP can be edited in the YAML file')}</div>}
                >
                  <HelpIcon />
                </Popover>
              </Text>
            }
            id={`nncp-interface-stp-${id}`}
            isChecked={nncpInterface?.bridge?.options?.stp?.enabled}
            onChange={onSTPChange}
          />
        </FormGroup>
      )}
    </>
  );
};

export default NNCPInterface;
