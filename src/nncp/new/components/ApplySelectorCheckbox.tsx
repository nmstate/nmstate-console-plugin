import * as React from 'react';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { Checkbox, CheckboxProps, Popover } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';

type ApplySelectorCheckboxProps = {
  isChecked: boolean;
  onChange: CheckboxProps['onChange'];
};

const ApplySelectorCheckbox: React.FC<ApplySelectorCheckboxProps> = ({ isChecked, onChange }) => {
  const { t } = useNMStateTranslation();
  return (
    <Checkbox
      id="apply-nncp-selector"
      isChecked={isChecked}
      onChange={onChange}
      label={
        <>
          {t(
            'Apply this node network configuration policy only to specific subsets of nodes using the node selector',
          )}{' '}
          <Popover
            bodyContent={t(
              'Leaving this option unchecked will apply the policy over all matching nodes on the cluster',
            )}
          >
            <HelpIcon />
          </Popover>
        </>
      }
    />
  );
};

export default ApplySelectorCheckbox;
