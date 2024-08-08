import React, { FC, PropsWithChildren, SyntheticEvent } from 'react';

import { Button, ButtonVariant, Flex } from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';

type EditButtonProps = PropsWithChildren<{
  isEditable: boolean;
  onEditClick?: () => void;
  testId: string;
}>;

const EditButton: FC<EditButtonProps> = ({ children, onEditClick, isEditable, testId }) => (
  <Button
    onClick={(e: SyntheticEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onEditClick?.();
    }}
    data-test-id={testId}
    isDisabled={!isEditable}
    isInline
    variant={ButtonVariant.link}
  >
    <Flex>
      {children}
      <PencilAltIcon className="co-icon-space-l" />
    </Flex>
  </Button>
);

export default EditButton;
