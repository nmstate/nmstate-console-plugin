import React, { FC } from 'react';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';
import { EnactmentStatuses } from 'src/views/policies/constants';

import { RedExclamationCircleIcon } from '@openshift-console/dynamic-plugin-sdk';
import { Button, ButtonVariant, Stack, StackItem } from '@patternfly/react-core';
import { CheckIcon, CloseIcon, HourglassHalfIcon, InProgressIcon } from '@patternfly/react-icons';
import { global_danger_color_200 as dangerColor } from '@patternfly/react-tokens/dist/js/global_danger_color_200';
import { global_success_color_200 as successColor } from '@patternfly/react-tokens/dist/js/global_success_color_200';
import { V1beta1NodeNetworkConfigurationEnactment } from '@types';

import { categorizeEnactments } from './utils';

type NNCPStateColumnProps = {
  enactments: V1beta1NodeNetworkConfigurationEnactment[];
  onStateClick: (state: EnactmentStatuses) => void;
};

const NNCPStateColumn: FC<NNCPStateColumnProps> = ({ enactments, onStateClick }) => {
  const { t } = useNMStateTranslation();

  const { available, pending, failing, progressing, aborted } = categorizeEnactments(enactments);

  const states = [
    {
      icon: <RedExclamationCircleIcon />,
      number: failing.length,
      label: EnactmentStatuses.Failing,
    },
    {
      icon: <CloseIcon color={dangerColor.value} />,
      number: aborted.length,
      label: EnactmentStatuses.Aborted,
    },
    {
      icon: <CheckIcon color={successColor.value} />,
      number: available.length,
      label: EnactmentStatuses.Available,
    },
    {
      icon: <InProgressIcon />,
      number: progressing.length,
      label: EnactmentStatuses.Progressing,
    },
    {
      icon: <HourglassHalfIcon />,
      number: pending.length,
      label: EnactmentStatuses.Pending,
    },
  ].filter((state) => state.number > 0);

  return (
    <Stack hasGutter>
      {states.length === 0 && <StackItem>-</StackItem>}
      {states.map((state) => (
        <StackItem key={state.label}>
          <Button variant={ButtonVariant.link} isInline onClick={() => onStateClick(state.label)}>
            {state.icon} {state.number} {t(state.label)}
          </Button>
        </StackItem>
      ))}
    </Stack>
  );
};

export default NNCPStateColumn;
