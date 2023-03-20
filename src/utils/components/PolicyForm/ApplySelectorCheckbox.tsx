import * as React from 'react';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { Checkbox, CheckboxProps, Flex, FlexItem, Popover } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';

type ApplySelectorCheckboxProps = {
  isChecked: boolean;
  onChange: CheckboxProps['onChange'];
};

const ApplySelectorCheckbox: React.FC<ApplySelectorCheckboxProps> = ({ isChecked, onChange }) => {
  const { t } = useNMStateTranslation();
  return (
    <Flex flexWrap={{ default: 'nowrap' }} spacer={{ default: 'spacerNone' }}>
      <FlexItem spacer={{ default: 'spacerNone' }}>
        <Checkbox
          id="apply-nncp-selector"
          isChecked={isChecked}
          onChange={onChange}
          label={t(
            'Apply this NodeNetworkConfigurationPolicy only to specific subsets of nodes using the node selector',
          )}
        />
      </FlexItem>
      <FlexItem>
        <Popover
          bodyContent={t(
            'Deselect this box to apply the policy to all matching nodes on the cluster',
          )}
        >
          <HelpIcon />
        </Popover>
      </FlexItem>
    </Flex>
  );
};

export default ApplySelectorCheckbox;
