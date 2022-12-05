import React, { FC, useState } from 'react';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import {
  Button,
  FormFieldGroupExpandable,
  FormFieldGroupHeader,
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
  TextInput,
} from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons';

import { NETWORK_STATES } from './constants';
import { NodeNetworkConfigurationInterface } from 'nmstate-ts';

type NNCPInterfaceProps = {
  index: number;
  nncpInterface?: NodeNetworkConfigurationInterface | any;
  onInterfaceChange?: (
    updateInterface: (draftInterface: NodeNetworkConfigurationInterface) => void,
  ) => void;
};

const NNCPInterface: FC<NNCPInterfaceProps> = ({ index, nncpInterface, onInterfaceChange }) => {
  const { t } = useNMStateTranslation();
  const [isNetStateOpen, setNetStateOpen] = useState(false);

  const handleStateChange = (
    event: React.MouseEvent<Element, MouseEvent>,
    newState: NETWORK_STATES,
  ) => {
    onInterfaceChange((draftInterface: NodeNetworkConfigurationInterface) => {
      draftInterface.state = newState;
    });
  };

  const handleNameChange = (newName: string) => {
    onInterfaceChange((draftInterface: NodeNetworkConfigurationInterface) => {
      draftInterface.name = newName;
    });
  };

  return (
    <FormFieldGroupExpandable
      toggleAriaLabel="Details"
      isExpanded={true}
      header={
        <FormFieldGroupHeader
          titleText={{
            text: 'Node network configuration policy interface',
            id: 'nncp-interface-1',
          }}
          actions={
            <Button variant="plain" aria-label={t('Remove')}>
              <MinusCircleIcon />
            </Button>
          }
        />
      }
    >
      <FormGroup label={t('Interface name')} isRequired fieldId={`nncp-interface-name-${index}`}>
        <TextInput
          isRequired
          id={`nncp-interface-name-input-${index}`}
          name={`nncp-interface-name-input-${index}`}
          value={nncpInterface?.name}
          onChange={handleNameChange}
        />
      </FormGroup>
      <FormGroup label="Network state" isRequired fieldId={`nncp-interface-network-state-${index}`}>
        <Select
          menuAppendTo="parent"
          isOpen={isNetStateOpen}
          onToggle={setNetStateOpen}
          onSelect={handleStateChange}
          variant={SelectVariant.single}
          selections={nncpInterface?.state}
        >
          {Object.entries(NETWORK_STATES).map(([key, value]) => (
            <SelectOption key={key} value={key}>
              {value}
            </SelectOption>
          ))}
        </Select>
      </FormGroup>
    </FormFieldGroupExpandable>
  );
};

export default NNCPInterface;
