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
  return (
    <Stack hasGutter>
      {failing.length > 0 && (
        <StackItem>
          <RedExclamationCircleIcon /> {failing.length} {t('Failing')}
        </StackItem>
      )}
      {aborted.length > 0 && (
        <StackItem>
          <CloseIcon color={dangerColor.value} /> {aborted.length} {t('Aborted')}
        </StackItem>
      )}
      <StackItem>
        <CheckIcon color={successColor.value} /> {available.length} {t('Available')}
      </StackItem>
      <StackItem>
        <InProgressIcon /> {progressing.length} {t('Progressing')}
      </StackItem>
      <StackItem>
        <HourglassHalfIcon /> {pending.length} {t('Pending')}
      </StackItem>
    </Stack>
  );
};

export default NNCPStateColumn;
