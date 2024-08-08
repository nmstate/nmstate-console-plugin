import React, { FC } from 'react';

import {
  DefaultGroup,
  Node,
  WithDndDropProps,
  WithDragNodeProps,
  WithSelectionProps,
} from '@patternfly/react-topology';

type CustomGroupProps = {
  element: Node;
} & WithSelectionProps &
  WithDragNodeProps &
  WithDndDropProps;

const CustomGroup: FC<CustomGroupProps> = ({ element, ...rest }) => {
  const data = element.getData();

  return <DefaultGroup badge={data?.badge} element={element} {...rest} />;
};

export default CustomGroup;
