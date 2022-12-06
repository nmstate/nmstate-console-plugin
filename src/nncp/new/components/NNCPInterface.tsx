import React, { FC, useState } from 'react';
import { InterfaceType, NodeNetworkConfigurationInterface } from 'nmstate-ts';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { FormGroup, Select, SelectOption, SelectVariant, TextInput } from '@patternfly/react-core';

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
  };

  const handleNameChange = (newName: string) => {
    onInterfaceChange(id, (draftNNCPInterface) => (draftNNCPInterface.name = newName));
  };

  const handleTypechange = (event: React.MouseEvent<Element, MouseEvent>, newType: string) => {
    onInterfaceChange(
      id,
      (draftNNCPInterface) => (draftNNCPInterface.type = newType as InterfaceType),
    );
  };

  return (
    <>
      <FormGroup label={t('Interface name')} isRequired fieldId={`nncp-interface-name-${id}`}>
        <TextInput
          isRequired
          id={`nncp-interface-name-input-${id}`}
          name={`nncp-interface-name-input-${id}`}
          value={nncpInterface?.name}
          onChange={handleNameChange}
        />
      </FormGroup>
      <FormGroup label="Network state" isRequired fieldId={`nncp-interface-network-state-${id}`}>
        <Select
          menuAppendTo="parent"
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

      <FormGroup label="Type" isRequired fieldId={`nncp-interface-type-${id}`}>
        <Select
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
    </>
  );
};

export default NNCPInterface;
