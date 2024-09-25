import React, { Dispatch, FC, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';

import { NodeNetworkStateModelRef } from '@models';
import { Button, Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import { ListIcon } from '@patternfly/react-icons';
import TechPreview from '@utils/components/TechPreview/TechPreview';

import TopologyToolbarFilter from './TopologyToolbarFilter';

import './TopologyToolbar.scss';

type TopologyToolbarProps = {
  selectedNodeFilters: string[];
  setSelectedNodeFilters: Dispatch<SetStateAction<string[]>>;
  nodeNames: string[];
};

const TopologyButton: FC<TopologyToolbarProps> = (props) => {
  const navigate = useNavigate();
  const setSelectedNodeFilters = props.setSelectedNodeFilters;

  return (
    <Toolbar className="topology-toolbar" clearAllFilters={() => setSelectedNodeFilters([])}>
      <ToolbarContent className="topology-toolbar__content">
        <ToolbarGroup>
          <TopologyToolbarFilter {...props} />
          <TechPreview />
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem className="list-view-btn">
            <Button
              isInline
              variant="plain"
              onClick={() => navigate(`/k8s/cluster/${NodeNetworkStateModelRef}`)}
            >
              <ListIcon />
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
};

export default TopologyButton;
