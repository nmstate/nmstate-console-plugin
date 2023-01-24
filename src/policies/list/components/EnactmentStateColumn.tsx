import React from 'react';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { RedExclamationCircleIcon } from '@openshift-console/dynamic-plugin-sdk';
import { Stack, StackItem } from '@patternfly/react-core';
import { CheckIcon, CloseIcon, HourglassHalfIcon, InProgressIcon } from '@patternfly/react-icons';
import { global_danger_color_200 as dangerColor } from '@patternfly/react-tokens/dist/js/global_danger_color_200';
import { global_success_color_200 as successColor } from '@patternfly/react-tokens/dist/js/global_success_color_200';
import { V1beta1NodeNetworkConfigurationEnactment } from '@types';

import { categorizeEnactments } from './utils';

type NNCPStateColumnProps = {
  enactments: V1beta1NodeNetworkConfigurationEnactment[];
};

const NNCPStateColumn: React.FC<NNCPStateColumnProps> = ({ enactments }) => {
  const { t } = useNMStateTranslation();

  const { available, pending, failing, progressing, aborted } = categorizeEnactments(enactments);

  const states = [
    {
      icon: <RedExclamationCircleIcon />,
      number: failing.length,
      label: 'Failing',
    },
    {
      icon: <CloseIcon color={dangerColor.value} />,
      number: aborted.length,
      label: 'Aborted',
    },
    {
      icon: <CheckIcon color={successColor.value} />,
      number: available.length,
      label: 'Available',
    },
    {
      icon: <InProgressIcon />,
      number: progressing.length,
      label: 'Progressing',
    },
    {
      icon: <HourglassHalfIcon />,
      number: pending.length,
      label: 'Pending',
    },
  ];

  return (
    <Stack hasGutter>
      {states.map((state) => {
        if (state.number > 0) {
          return (
            <StackItem key={state.label}>
              {state.icon} {state.number} {t(state.label)}
            </StackItem>
          );
        }
      })}
    </Stack>
  );
};

export default NNCPStateColumn;
