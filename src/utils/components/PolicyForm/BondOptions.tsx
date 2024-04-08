import React, { FC, FormEvent } from 'react';
import { ensurePath } from 'src/utils/helpers';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { Button, FormGroup, Grid, GridItem, TextInput } from '@patternfly/react-core';
import { MinusCircleIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { NodeNetworkConfigurationInterface } from '@types';

import { BOND_OPTIONS_KEYS } from './constants';

type BondOptionsProps = {
  id: number;
  policyInterface?: NodeNetworkConfigurationInterface;
  onInterfaceChange?: (
    updateInterface: (policyInterface: NodeNetworkConfigurationInterface) => void,
  ) => void;
};

const BondOptions: FC<BondOptionsProps> = ({ id, onInterfaceChange, policyInterface }) => {
  const { t } = useNMStateTranslation();
  const options = policyInterface?.['link-aggregation']?.options || {};

  const selectableOptions = BOND_OPTIONS_KEYS.filter((optionKey) => !(optionKey in options));

  const onKeyChange = (oldKey, newKey) => {
    onInterfaceChange((draftInterface) => {
      ensurePath(draftInterface, 'link-aggregation.options');
      draftInterface['link-aggregation'].options[newKey] =
        draftInterface['link-aggregation'].options[oldKey];
      delete draftInterface['link-aggregation'].options[oldKey];
    });
  };

  const onOptionValue = (key, value) => {
    onInterfaceChange((draftInterface) => {
      ensurePath(draftInterface, 'link-aggregation.options');
      draftInterface['link-aggregation'].options[key] = value;
    });
  };

  const onDelete = (key) => {
    onInterfaceChange((draftInterface) => {
      ensurePath(draftInterface, 'link-aggregation.options');
      delete draftInterface['link-aggregation'].options[key];
    });
  };

  const onOptionAdd = () => {
    onInterfaceChange((draftInterface) => {
      ensurePath(draftInterface, 'link-aggregation.options');
      draftInterface['link-aggregation'].options[selectableOptions[0]] = '';
    });
  };

  return (
    <>
      {Object.entries(options).map(([key, value], index) => (
        <Grid key={index}>
          <GridItem span={5}>
            <FormGroup label={t('Key')} fieldId={`label-${id}-key-input`}>
              <TextInput
                id={`label-${id}-key-input`}
                placeholder={t('Key')}
                isRequired
                type="text"
                value={key}
                onChange={(newKey) => onKeyChange(key, newKey)}
                aria-label={t('selector key')}
              />
            </FormGroup>
          </GridItem>
          <GridItem span={1} />
          <GridItem span={5}>
            <FormGroup label={t('Value')} fieldId={`label-${id}-value-input`}>
              <TextInput
                id={`label-${id}-value-input`}
                placeholder={t('Value')}
                isRequired
                type="text"
                value={value}
                onChange={(event: FormEvent<HTMLInputElement>, newValue: string) =>
                  onOptionValue(key, newValue)
                }
                aria-label={t('selector value')}
              />
            </FormGroup>
          </GridItem>

          <GridItem span={1}>
            <FormGroup label=" " fieldId={`label-${id}-delete-btn`}>
              <Button variant="plain" onClick={() => onDelete(key)}>
                <MinusCircleIcon />
              </Button>
            </FormGroup>
          </GridItem>
        </Grid>
      ))}

      {selectableOptions.length > 0 && (
        <Button
          className="pf-m-link-align-left pf-m-text-align-left"
          id="add-option-button"
          variant="link"
          onClick={() => onOptionAdd()}
          icon={<PlusCircleIcon />}
        >
          {t('Add Option')}
        </Button>
      )}
    </>
  );
};

export default BondOptions;
