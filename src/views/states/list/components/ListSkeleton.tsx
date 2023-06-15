import React, { FC } from 'react';

import { Flex, Skeleton, Stack, StackItem } from '@patternfly/react-core';

const LinkSkeleton: FC = () => (
  <div>
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
  </div>
);

export default LinkSkeleton;
