import React from 'react';
import NodeNetworkStateModel from 'src/console-models/NodeNetworkStateModel';

import { ListPageBody, ListPageHeader } from '@openshift-console/dynamic-plugin-sdk';
import { Flex, Skeleton, Stack, StackItem } from '@patternfly/react-core';
import { useNMStateTranslation } from '@utils/hooks/useNMStateTranslation';

const LinkSkeleton: React.FC = () => {
  const { t } = useNMStateTranslation();
  return (
    <div>
      <ListPageHeader title={t(NodeNetworkStateModel.label)}></ListPageHeader>
      <ListPageBody>
        <Stack hasGutter>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
            <Skeleton width="30%" fontSize="2xl" />
            <Skeleton width="30%" fontSize="2xl" />
            <Skeleton width="30%" fontSize="2xl" />
          </Flex>

          <StackItem>
            <Skeleton fontSize="lg" />
          </StackItem>
          <StackItem>
            <Skeleton fontSize="lg" />
          </StackItem>
          <StackItem>
            <Skeleton fontSize="lg" />
          </StackItem>
          <StackItem>
            <Skeleton fontSize="lg" />
          </StackItem>
        </Stack>
      </ListPageBody>
    </div>
  );
};

export default LinkSkeleton;
