import React, { FC } from 'react';

import { EmptyState, EmptyStateVariant, Title } from '@patternfly/react-core';
import { useNMStateTranslation } from '@utils/hooks/useNMStateTranslation';

const NNStateEmptyState: FC = () => {
  const { t } = useNMStateTranslation();
  return (
    <EmptyState variant={EmptyStateVariant.full}>
      <Title headingLevel="h5" size="lg">
        {t('No NodeNetworkStates found')}
      </Title>
    </EmptyState>
  );
};

export default NNStateEmptyState;
