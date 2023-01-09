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

import BondOptions from './BondOptions';
import { INTERFACE_TYPE_OPTIONS, NETWORK_STATES } from './constants';
import CopyMAC from './CopyMAC';

export type onInterfaceChangeType = (policyInterface: NodeNetworkConfigurationInterface) => void;

type PolicyInterfaceProps = {
  id: number;
  policyInterface?: NodeNetworkConfigurationInterface;
  onInterfaceChange?: (updateInterface: onInterfaceChangeType) => void;
};

const PolicyInterface: FC<PolicyInterfaceProps> = ({ id, policyInterface, onInterfaceChange }) => {
  const { t } = useNMStateTranslation();
  const [isStateOpen, setStateOpen] = useState(false);
  const [isTypeOpen, setTypeOpen] = useState(false);
  const [isAggregationOpen, setAggregationOpen] = useState(false);

  const handleStateChange = (
    event: React.MouseEvent<Element, MouseEvent>,
    newState: NETWORK_STATES,
  ) => {
    onInterfaceChange((draftInterface) => (draftInterface.state = newState));
    setStateOpen(false);
  };

  const handleNameChange = (newName: string) => {
    onInterfaceChange((draftInterface) => (draftInterface.name = newName));
  };

  const handleTypechange = (event: React.MouseEvent<Element, MouseEvent>, newType: string) => {
    onInterfaceChange((draftInterface) => {
      draftInterface.type = newType as InterfaceType;

      if (newType === InterfaceType.LINUX_BRIDGE) draftInterface.bridge = { port: [], options: {} };

      if (newType === InterfaceType.BOND)
        draftInterface['link-aggregation'] = {
          mode: NodeNetworkConfigurationInterfaceBondMode.BALANCE_RR,
          port: [],
        };
    });
    setTypeOpen(false);
  };

  const onIP4Change = (checked: boolean) => {
    if (checked) onInterfaceChange((draftInterface) => (draftInterface.ipv4 = { enabled: true }));
    else {
      onInterfaceChange((draftInterface) => {
        delete draftInterface.ipv4;
      });
    }
  };

  const onDHCPChange = (checked: boolean) => {
    onInterfaceChange((draftInterface) => (draftInterface.ipv4.dhcp = checked));
  };

  const onSTPChange = (checked: boolean) => {
    onInterfaceChange((draftInterface) => {
      ensurePath(draftInterface, 'bridge.options');

      draftInterface.bridge = {
        options: {
          stp: { enabled: checked },
        },
      };
    });
  };

  const handleAggregationChange = (
    event: React.MouseEvent<Element, MouseEvent>,
    aggregationMode: string,
  ) => {
    onInterfaceChange((draftInterface) => {
      ensurePath(draftInterface, 'link-aggregation');
      draftInterface['link-aggregation'].mode =
        aggregationMode as NodeNetworkConfigurationInterfaceBondMode;
    });
  };

  const onPortChange = (value: string) => {
    onInterfaceChange((draftInterface) => {
      if (draftInterface.type === InterfaceType.BOND) {
        ensurePath(draftInterface, 'link-aggregation.port');
        draftInterface['link-aggregation'].port = value.split(',');
      }

      if (draftInterface.type === InterfaceType.LINUX_BRIDGE) {
        ensurePath(draftInterface, 'bridge.port');
        draftInterface.bridge.port = [{ name: value }];
      }
    });
  };

  return (
    <>
      <FormGroup label={t('Interface name')} isRequired fieldId={`policy-interface-name-${id}`}>
        <TextInput
          isRequired
          id={`policy-interface-name-${id}`}
          name={`policy-interface-name-${id}`}
          value={policyInterface?.name}
          onChange={handleNameChange}
        />
      </FormGroup>
      <FormGroup
        label={t('Network state')}
        isRequired
        fieldId={`policy-interface-network-state-${id}`}
      >
        <Select
          menuAppendTo="parent"
          id={`policy-interface-network-state-${id}`}
          isOpen={isStateOpen}
          onToggle={setStateOpen}
          onSelect={handleStateChange}
          variant={SelectVariant.single}
          selections={policyInterface?.state}
        >
          {Object.entries(NETWORK_STATES).map(([key, value]) => (
            <SelectOption key={key} value={value}>
              {key}
            </SelectOption>
          ))}
        </Select>
      </FormGroup>

      <FormGroup label={t('Type')} isRequired fieldId={`policy-interface-type-${id}`}>
        <Select
          id={`policy-interface-type-${id}`}
          menuAppendTo="parent"
          isOpen={isTypeOpen}
          onToggle={setTypeOpen}
          onSelect={handleTypechange}
          variant={SelectVariant.single}
          selections={policyInterface?.type}
        >
          {Object.entries(INTERFACE_TYPE_OPTIONS).map(([key, value]) => (
            <SelectOption key={key} value={key}>
              {value}
            </SelectOption>
          ))}
        </Select>
      </FormGroup>
      <FormGroup label={t('IP configuration')} fieldId={`policy-interface-ip-${id}`}>
        <Checkbox
          label={t('IPV4')}
          id={`policy-interface-ip-${id}`}
          isChecked={!!policyInterface.ipv4}
          onChange={onIP4Change}
        />
        {!!policyInterface.ipv4 && (
          <Checkbox
            label={t('DHCP')}
            id={`policy-interface-dhcp-${id}`}
            isChecked={policyInterface.ipv4.dhcp}
            onChange={onDHCPChange}
          />
        )}
      </FormGroup>
      <FormGroup
        label={t('Port')}
        fieldId={`policy-interface-port-${id}`}
        helperText={
          policyInterface.type === InterfaceType.BOND && t('Use commas to separate between ports')
        }
      >
        <TextInput
          value={
            policyInterface?.bridge?.port?.[0]?.name ||
            policyInterface?.['link-aggregation']?.port.join(',')
          }
          type="text"
          id={`policy-interface-port-${id}`}
          onChange={onPortChange}
        />
      </FormGroup>

      {policyInterface.type === InterfaceType.LINUX_BRIDGE && (
        <FormGroup fieldId={`policy-interface-stp-${id}`}>
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
            id={`policy-interface-stp-${id}`}
            isChecked={policyInterface?.bridge?.options?.stp?.enabled}
            onChange={onSTPChange}
          />
        </FormGroup>
      )}

      {policyInterface.type === InterfaceType.BOND && (
        <>
          <CopyMAC
            id={id}
            onInterfaceChange={onInterfaceChange}
            policyInterface={policyInterface}
          />
          <FormGroup
            label={t('Aggregation mode')}
            isRequired
            fieldId={`policy-interface-aggregation-${id}`}
          >
            <Select
              id={`policy-interface-aggregation-${id}`}
              menuAppendTo="parent"
              isOpen={isAggregationOpen}
              onToggle={setAggregationOpen}
              onSelect={handleAggregationChange}
              variant={SelectVariant.single}
              selections={policyInterface?.['link-aggregation']?.mode}
            >
              {Object.entries(NodeNetworkConfigurationInterfaceBondMode).map(([key, value]) => (
                <SelectOption key={key} value={key}>
                  {value}
                </SelectOption>
              ))}
            </Select>
          </FormGroup>
          <BondOptions
            onInterfaceChange={onInterfaceChange}
            policyInterface={policyInterface}
            id={id}
          />
        </>
      )}
    </>
  );
};

export default PolicyInterface;
