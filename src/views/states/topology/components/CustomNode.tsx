import React, { FC } from 'react';

import {
  DefaultNode,
  Node,
  WithDndDropProps,
  WithDragNodeProps,
  WithSelectionProps,
} from '@patternfly/react-topology';

import { ICON_SIZE } from '../utils/constants';

type CustomNodeProps = {
  element: Node;
} & WithSelectionProps &
  WithDragNodeProps &
  WithDndDropProps;

const CustomNode: FC<CustomNodeProps> = ({ element, onSelect, selected }) => {
  const data = element.getData();
  const Icon = data.icon;
  const { width, height } = element.getBounds();

  const xCenter = (width - ICON_SIZE) / 2;
  const yCenter = (height - ICON_SIZE) / 2;

  return (
    <DefaultNode
      badge={data.badge}
      element={element}
      onSelect={onSelect}
      selected={selected}
      truncateLength={8}
    >
      <g transform={`translate(${xCenter}, ${yCenter})`}>
        <Icon width={ICON_SIZE} height={ICON_SIZE} />
      </g>
    </DefaultNode>
  );
};

export default CustomNode;
