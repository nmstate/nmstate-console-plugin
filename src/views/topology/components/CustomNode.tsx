import React, { FC } from 'react';
import {
  DefaultNode,
  Node,
  WithDndDropProps,
  WithDragNodeProps,
  WithSelectionProps,
} from '@patternfly/react-topology';

type CustomNodeProps = {
  element: Node;
} & WithSelectionProps &
  WithDragNodeProps &
  WithDndDropProps;

const CustomNode: FC<CustomNodeProps> = ({ element, onSelect, selected }) => {
  const data = element.getData();
  const Icon = data.icon;
  const iconSize = 15;
  const { width, height } = element.getBounds();

  const xCenter = (width - iconSize) / 2;
  const yCenter = (height - iconSize) / 2;

  return (
    <DefaultNode
      badge={data.badge}
      element={element}
      onSelect={onSelect}
      selected={selected}
      truncateLength={8}
    >
      <g transform={`translate(${xCenter}, ${yCenter})`}>
        <Icon style={{ color: '#393F44' }} width={iconSize} height={iconSize} />
      </g>
    </DefaultNode>
  );
};

export default CustomNode;
