import React, { Ref } from 'react';

import { MenuToggle, MenuToggleElement, MenuToggleProps } from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons';

const KebabToggle = (props: MenuToggleProps) =>
  function KToggle(toggleRef: Ref<MenuToggleElement>) {
    return (
      <MenuToggle ref={toggleRef} {...props} variant="plain">
        <EllipsisVIcon />
      </MenuToggle>
    );
  };

export default KebabToggle;
