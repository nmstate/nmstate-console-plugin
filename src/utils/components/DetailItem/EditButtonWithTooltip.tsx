import React, { FC, PropsWithChildren, ReactNode } from 'react';

import { Tooltip } from '@patternfly/react-core';

import EditButton from './EditButton';

type EditButtonWithTooltipProps = PropsWithChildren<{
  isEditable: boolean;
  onEditClick: () => void;
  testId: string;
  tooltipContent?: ReactNode;
}>;

const EditButtonWithTooltip: FC<EditButtonWithTooltipProps> = ({
  children,
  isEditable,
  tooltipContent,
  ...rest
}) => {
  if (!isEditable && tooltipContent) {
    return (
      <Tooltip content={tooltipContent}>
        <EditButton {...rest} isEditable={isEditable}>
          {children}
        </EditButton>
      </Tooltip>
    );
  }

  return (
    <EditButton {...rest} isEditable={isEditable}>
      {children}
    </EditButton>
  );
};

export default EditButtonWithTooltip;
