import React, { FC } from 'react';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { Button, FormGroup, GridItem, TextInput, Tooltip } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons';

import { IDLabel } from '../utils/types';

type LabelRowProps = {
  label: IDLabel;
  onChange: (label: IDLabel) => void;
  onDelete: (id: number) => void;
};

const LabelRow: FC<LabelRowProps> = ({ label, onChange, onDelete }) => {
  const { t } = useNMStateTranslation();
  const { id, key, value } = label;
  return (
    <>
      <GridItem span={6}>
        <FormGroup label={t('Key')} fieldId={`label-${id}-key-input`}>
          <TextInput
            id={`label-${id}-key-input`}
            placeholder={t('Key')}
            isRequired
            type="text"
            value={key}
            onChange={(_, newKey) => onChange({ ...label, key: newKey })}
            aria-label={t('selector key')}
          />
        </FormGroup>
      </GridItem>
      <GridItem span={5}>
        <FormGroup label={t('Value')} fieldId={`label-${id}-value-input`}>
          <TextInput
            id={`label-${id}-value-input`}
            placeholder={t('Value')}
            isRequired
            type="text"
            value={value}
            onChange={(_, newValue) => onChange({ ...label, value: newValue })}
            aria-label={t('selector value')}
          />
        </FormGroup>
      </GridItem>

      <GridItem span={1}>
        <FormGroup label=" " fieldId={`label-${id}-delete-btn`}>
          <Tooltip content={t('Remove label selector')}>
            <Button variant="plain" onClick={() => onDelete(id)}>
              <MinusCircleIcon />
            </Button>
          </Tooltip>
        </FormGroup>
      </GridItem>
    </>
  );
};

export default LabelRow;
