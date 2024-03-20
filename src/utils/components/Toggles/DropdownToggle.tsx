import React, { Ref } from 'react';

import { MenuToggle, MenuToggleElement, MenuToggleProps } from '@patternfly/react-core';

const DropdownToggle = ({ children, ...props }: MenuToggleProps) =>
  function DToggle(toggleRef: Ref<MenuToggleElement>) {
    return (
      <MenuToggle ref={toggleRef} {...props}>
        {children}
      </MenuToggle>
    );
  };

export default DropdownToggle;
