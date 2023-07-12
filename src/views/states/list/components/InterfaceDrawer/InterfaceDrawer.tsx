import React, { FC, useCallback } from 'react';

import { Modal, Title } from '@patternfly/react-core';
import { NodeNetworkConfigurationInterface } from '@types';
import { useNMStateTranslation } from '@utils/hooks/useNMStateTranslation';

import useDrawerInterface from '../../hooks/useDrawerInterface';

import { InterfaceDrawerTabId, InterfaceDrawerTabProps } from './constants';
import InterfaceDrawerDetailsTab from './InterfaceDrawerDetailsTab';
import InterfaceDrawerYAMLFooter from './InterfaceDrawerFooter';
import InterfaceDrawerYAMLTab from './InterfaceDrawerYAMLTab';

const InterfaceDrawer: FC<{ selectedInterface: NodeNetworkConfigurationInterface }> = ({
  selectedInterface,
}) => {
  const { t } = useNMStateTranslation();
  const { setSelectedInterfaceName } = useDrawerInterface();

  const onClose = useCallback(() => {
    setSelectedInterfaceName();
  }, []);

  const Tabs: InterfaceDrawerTabProps[] = [
    {
      title: t('Details'),
      id: 'drawer-details',
      component: InterfaceDrawerDetailsTab,
    },
    {
      title: t('YAML'),
      id: 'drawer-yaml',
      component: InterfaceDrawerYAMLTab,
    },
  ];

  const selectedTab = (location.hash.replace('#', '') as InterfaceDrawerTabId) || Tabs?.[0]?.id;

  const SelectedTabComponent =
    Tabs.find((tab) => tab.id === selectedTab)?.component ?? Tabs?.[0]?.component;

  return (
    <Modal
      aria-label="Interface drawer"
      className="ocs-modal co-catalog-page__overlay co-catalog-page__overlay--right interface-drawer"
      isOpen={!!selectedInterface}
      onClose={onClose}
      disableFocusTrap
      header={<Title headingLevel="h2">{selectedInterface?.name}</Title>}
      data-test="interface-drawer"
      footer={
        selectedTab === 'drawer-yaml' && (
          <InterfaceDrawerYAMLFooter selectedInterface={selectedInterface} />
        )
      }
    >
      <div className="co-m-horizontal-nav pf-u-px-md">
        <ul className="co-m-horizontal-nav__menu">
          {Tabs.map((tab) => (
            <li
              key={tab.id}
              className={`co-m-horizontal-nav__menu-item ${
                selectedTab === tab.id ? 'co-m-horizontal-nav-item--active' : ''
              }`}
              data-test={`horizontal-tab-${tab.id}`}
            >
              <a
                data-test-id="horizontal-link-Details"
                href={`${location.pathname}${location.search}#${tab.id}`}
              >
                {tab.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="pf-u-p-xl">
        <SelectedTabComponent selectedInterface={selectedInterface} />
      </div>
    </Modal>
  );
};

export default InterfaceDrawer;
