import React, { FC } from 'react';
import { NodeNetworkConfigurationInterfaceBondMode } from 'src/nmstate-types/custom-models/NodeNetworkConfigurationInterfaceBondMode';
import { ensurePath } from 'src/utils/helpers';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { RedExclamationCircleIcon } from '@openshift-console/dynamic-plugin-sdk';
import {
  Checkbox,
  Flex,
  FlexItem,
  FormGroup,
  FormHelperText,
  FormSelect,
  FormSelectOption,
  FormSelectProps,
  HelperText,
  HelperTextItem,
  NumberInput,
  Popover,
  Radio,
  Text,
  TextInput,
  ValidatedOptions,
} from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import {
  AUTO_DNS,
  AUTO_GATEWAY,
  AUTO_ROUTES,
  InterfaceType,
  NodeNetworkConfigurationInterface,
  V1NodeNetworkConfigurationPolicy,
} from '@types';

import BondOptions from './BondOptions';
import { DEFAULT_PREFIX_LENGTH, INTERFACE_TYPE_OPTIONS, NETWORK_STATES } from './constants';
import CopyMAC from './CopyMAC';
import { isOVSBridgeExisting, validateInterfaceName } from './utils';

export type onInterfaceChangeType = (
  policyInterface: NodeNetworkConfigurationInterface,
  policy: V1NodeNetworkConfigurationPolicy,
) => void;

type HandleSelectChange = FormSelectProps['onChange'];

type PolicyInterfaceProps = {
  id: number;
  isInterfaceCreated?: boolean;
  policyInterface?: NodeNetworkConfigurationInterface;
  onInterfaceChange?: (updateInterface: onInterfaceChangeType) => void;
};

const PolicyInterface: FC<PolicyInterfaceProps> = ({
  id,
  policyInterface,
  onInterfaceChange,
  isInterfaceCreated = true,
}) => {
  const { t } = useNMStateTranslation();

  const handleStateChange: HandleSelectChange = (event, newState: NETWORK_STATES) => {
    onInterfaceChange((draftInterface) => (draftInterface.state = newState));
  };

  const handleNameChange = (newName: string) => {
    onInterfaceChange((draftInterface) => (draftInterface.name = newName));
  };

  const handleTypechange: HandleSelectChange = (event, newType: string) => {
    onInterfaceChange((draftInterface, draftPolicy) => {
      draftInterface.type = newType as InterfaceType;
      !isOVSBridgeExisting(draftPolicy) && delete draftPolicy.spec.desiredState.ovn;

      if (newType === InterfaceType.LINUX_BRIDGE) {
        delete draftInterface['link-aggregation'];
        draftInterface.bridge = { port: [], options: { stp: { enabled: false } } };
      }

      if (newType === InterfaceType.OVS_BRIDGE) {
        delete draftInterface['link-aggregation'];
        draftInterface.bridge = { port: [], options: {} };
        if (!draftPolicy?.spec?.desiredState?.ovn) {
          draftPolicy.spec.desiredState.ovn = {
            'bridge-mapping': [],
          };
        }
        draftPolicy.spec.desiredState.ovn['bridge-mapping'].push({
          bridge: '',
          localnet: '',
          state: 'present',
        });
      }

      if (newType === InterfaceType.BOND) {
        delete draftInterface.bridge;
        draftInterface['link-aggregation'] = {
          mode: NodeNetworkConfigurationInterfaceBondMode.BALANCE_RR,
          port: [],
        };
      }

      if (newType === InterfaceType.ETHERNET) {
        delete draftInterface.bridge;
        delete draftInterface['link-aggregation'];
      }
    });
  };

  const onIP4Change = (checked: boolean) => {
    if (checked)
      onInterfaceChange(
        (draftInterface) =>
          (draftInterface.ipv4 = {
            enabled: true,
            address: [{ ip: '', 'prefix-length': DEFAULT_PREFIX_LENGTH }],
          }),
      );
    else {
      onInterfaceChange((draftInterface) => {
        delete draftInterface.ipv4;
      });
    }
  };

  const onDHCPChange = (checked: boolean) => {
    onInterfaceChange((draftInterface) => {
      draftInterface.ipv4 = { enabled: true, dhcp: checked };
    });
  };

  const onAddressChange = (value: string) => {
    onInterfaceChange((draftInterface) => {
      draftInterface.ipv4 = {
        enabled: true,
        address: [{ ip: value, 'prefix-length': DEFAULT_PREFIX_LENGTH }],
      };
    });
  };

  const onPrefixChange = (value: number) => {
    onInterfaceChange((draftInterface) => {
      if (draftInterface.ipv4.address.length > 0)
        draftInterface.ipv4.address[0]['prefix-length'] = value;
    });
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

  const handleAggregationChange: HandleSelectChange = (event, aggregationMode: string) => {
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

        value
          ? (draftInterface['link-aggregation'].port = value.split(','))
          : delete draftInterface['link-aggregation'].port;
      }

      if (
        draftInterface.type === InterfaceType.LINUX_BRIDGE ||
        draftInterface.type === InterfaceType.OVS_BRIDGE
      ) {
        ensurePath(draftInterface, 'bridge.port');
        value
          ? (draftInterface.bridge.port = [{ name: value }])
          : delete draftInterface.bridge.port;
      }
    });
  };

  const nameError = validateInterfaceName(policyInterface?.name);

  return (
    <>
      <FormGroup label={t('Interface name')} isRequired fieldId={`policy-interface-name-${id}`}>
        <TextInput
          isRequired
          id={`policy-interface-name-${id}`}
          name={`policy-interface-name-${id}`}
          value={policyInterface?.name}
          onChange={(_, newValue) => handleNameChange(newValue)}
          isDisabled={isInterfaceCreated}
        />
        {nameError && (
          <FormHelperText>
            <HelperText>
              <HelperTextItem icon={<RedExclamationCircleIcon />} variant={ValidatedOptions.error}>
                {nameError}
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        )}
      </FormGroup>
      <FormGroup
        label={t('Network state')}
        isRequired
        fieldId={`policy-interface-network-state-${id}`}
      >
        <FormSelect
          id={`policy-interface-network-state-${id}`}
          onChange={handleStateChange}
          value={policyInterface?.state}
        >
          {Object.entries(NETWORK_STATES).map(([key, value]) => (
            <FormSelectOption key={key} value={value} label={key} />
          ))}
        </FormSelect>
      </FormGroup>

      <FormGroup label={t('Type')} isRequired fieldId={`policy-interface-type-${id}`}>
        <FormSelect
          id={`policy-interface-type-${id}`}
          onChange={handleTypechange}
          value={policyInterface?.type}
          isDisabled={isInterfaceCreated}
        >
          {Object.entries(INTERFACE_TYPE_OPTIONS).map(([key, value]) => (
            <FormSelectOption key={key} value={key} label={value} />
          ))}
        </FormSelect>
      </FormGroup>
      <FormGroup label={t('IP configuration')} fieldId={`policy-interface-ip-${id}`}>
        <Checkbox
          label={t('IPv4')}
          id={`policy-interface-ip-${id}`}
          isChecked={policyInterface?.ipv4?.enabled}
          onChange={(_, newValue) => onIP4Change(newValue)}
        />
        <div className="pf-u-ml-md pf-u-mt-sm">
          {policyInterface?.ipv4 && (
            <Flex className="pf-u-mb-md">
              <FlexItem>
                <Radio
                  label={t('IP address')}
                  name={`ip-or-dhcp-${id}`}
                  id={`ip-${id}`}
                  isChecked={!policyInterface?.ipv4?.dhcp}
                  onChange={() => onAddressChange('')}
                />
              </FlexItem>

              <FlexItem>
                <Radio
                  label={t('DHCP')}
                  name={`ip-or-dhcp-${id}`}
                  id={`dhcp-${id}`}
                  isChecked={policyInterface?.ipv4?.dhcp}
                  onChange={(_, newValue) => onDHCPChange(newValue)}
                />
              </FlexItem>
            </Flex>
          )}
          {policyInterface?.ipv4 && !policyInterface?.ipv4?.dhcp && (
            <>
              <FormGroup
                label={t('IPV4 address')}
                isRequired
                fieldId={`ipv4-address-${id}`}
                className="pf-u-mb-md"
              >
                <TextInput
                  value={policyInterface?.ipv4?.address?.[0]?.ip}
                  type="text"
                  id={`ipv4-address-${id}`}
                  onChange={(_, newValue) => onAddressChange(newValue)}
                />
              </FormGroup>
              <FormGroup label={t('Prefix length')} isRequired fieldId={`prefix-length-${id}`}>
                <NumberInput
                  value={policyInterface?.ipv4?.address?.[0]?.['prefix-length']}
                  id={`prefix-length-${id}`}
                  onChange={(event) => onPrefixChange(event.currentTarget.valueAsNumber)}
                  onMinus={() =>
                    onPrefixChange(policyInterface.ipv4.address[0]['prefix-length'] - 1)
                  }
                  onPlus={() =>
                    onPrefixChange(policyInterface.ipv4.address[0]['prefix-length'] + 1)
                  }
                  min={0}
                  max={32}
                />
              </FormGroup>
            </>
          )}

          {!!policyInterface?.ipv4?.dhcp && (
            <>
              <Checkbox
                label={t('Auto-DNS')}
                id={`policy-interface-dns-${id}`}
                isChecked={
                  policyInterface?.ipv4[AUTO_DNS] === true ||
                  policyInterface?.ipv4[AUTO_DNS] === undefined
                }
                onChange={(_, checked) =>
                  onInterfaceChange((draftInterface) => (draftInterface.ipv4[AUTO_DNS] = checked))
                }
              />
              <Checkbox
                label={t('Auto-routes')}
                id={`policy-interface-routes-${id}`}
                isChecked={
                  policyInterface?.ipv4[AUTO_ROUTES] === true ||
                  policyInterface?.ipv4[AUTO_ROUTES] === undefined
                }
                onChange={(_, checked) =>
                  onInterfaceChange(
                    (draftInterface) => (draftInterface.ipv4[AUTO_ROUTES] = checked),
                  )
                }
              />
              <Checkbox
                label={t('Auto-gateway')}
                id={`policy-interface-gateway-${id}`}
                isChecked={
                  policyInterface?.ipv4[AUTO_GATEWAY] === true ||
                  policyInterface?.ipv4[AUTO_GATEWAY] === undefined
                }
                onChange={(_, checked) =>
                  onInterfaceChange(
                    (draftInterface) => (draftInterface.ipv4[AUTO_GATEWAY] = checked),
                  )
                }
              />
            </>
          )}
        </div>
      </FormGroup>

      {policyInterface.type !== InterfaceType.ETHERNET && (
        <FormGroup label={t('Port')} fieldId={`policy-interface-port-${id}`}>
          <TextInput
            value={
              policyInterface?.bridge?.port?.[0]?.name ||
              policyInterface?.['link-aggregation']?.port?.join(',')
            }
            type="text"
            id={`policy-interface-port-${id}`}
            onChange={(_, newValue) => onPortChange(newValue)}
          />

          {policyInterface.type === InterfaceType.BOND && (
            <FormHelperText>
              <HelperText>
                <HelperTextItem variant="default">
                  {t('Use commas to separate ports')}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          )}
        </FormGroup>
      )}
      {(policyInterface.type === InterfaceType.LINUX_BRIDGE ||
        policyInterface.type === InterfaceType.OVS_BRIDGE) && (
        <FormGroup fieldId={`policy-interface-stp-${id}`}>
          <Checkbox
            label={
              <Text>
                {t('Enable STP')}{' '}
                {isInterfaceCreated && (
                  <Popover
                    aria-label={'Help'}
                    bodyContent={() => <div>{t('Edit the STP in the YAML file')}</div>}
                  >
                    <HelpIcon />
                  </Popover>
                )}
              </Text>
            }
            id={`policy-interface-stp-${id}`}
            isChecked={policyInterface?.bridge?.options?.stp?.enabled !== false}
            onChange={(_, newValue) => onSTPChange(newValue)}
            isDisabled={isInterfaceCreated}
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
            <FormSelect
              id={`policy-interface-aggregation-${id}`}
              onChange={handleAggregationChange}
              value={policyInterface?.['link-aggregation']?.mode}
            >
              {Object.entries(NodeNetworkConfigurationInterfaceBondMode).map(([key, value]) => (
                <FormSelectOption key={key} value={value} label={value} />
              ))}
            </FormSelect>
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
