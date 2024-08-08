import React, { ChangeEvent, Dispatch, FC, MouseEvent, SetStateAction, useState } from 'react';

import {
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  ToolbarFilter,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import { useNMStateTranslation } from '@utils/hooks/useNMStateTranslation';

import './TopologyToolbar.scss';

type TopologyToolbarFilterProps = {
  selectedNodeFilters: string[];
  setSelectedNodeFilters: Dispatch<SetStateAction<string[]>>;
  nodeNames: string[];
};
const TopologyToolbarFilter: FC<TopologyToolbarFilterProps> = ({
  nodeNames,
  selectedNodeFilters,
  setSelectedNodeFilters,
}) => {
  const { t } = useNMStateTranslation();
  const [isNodeFilterExpanded, setIsNodeFilterExpanded] = useState(false);

  const onClearAllFilters = () => setSelectedNodeFilters([]);
  const onNodeFilterSelect = (event: MouseEvent | ChangeEvent, selection: string) => {
    const checked = (event.target as HTMLInputElement).checked;
    setSelectedNodeFilters((prevFilters) => {
      if (checked) {
        return [...prevFilters, selection];
      }

      return prevFilters.filter((value) => value !== selection);
    });
  };
  return (
    <ToolbarFilter
      chips={selectedNodeFilters}
      deleteChip={(_, chip) =>
        setSelectedNodeFilters(selectedNodeFilters.filter((filter) => filter !== chip))
      }
      deleteChipGroup={onClearAllFilters}
      categoryName="nodes"
    >
      <Select
        role="menu"
        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
          <MenuToggle
            ref={toggleRef}
            onClick={() => setIsNodeFilterExpanded(!isNodeFilterExpanded)}
            isExpanded={isNodeFilterExpanded}
            className="topology-filter__toggle"
          >
            <FilterIcon className="topology-filter__icon" />
            {t('Filter')}
          </MenuToggle>
        )}
        onSelect={onNodeFilterSelect}
        selected={selectedNodeFilters}
        isOpen={isNodeFilterExpanded}
        onOpenChange={(isOpen) => setIsNodeFilterExpanded(isOpen)}
      >
        <SelectList>
          {nodeNames.map((name) => (
            <SelectOption
              hasCheckbox
              key={name}
              value={name}
              isSelected={selectedNodeFilters.includes(name)}
            >
              {name}
            </SelectOption>
          ))}
        </SelectList>
      </Select>
    </ToolbarFilter>
  );
};

export default TopologyToolbarFilter;
