import React, { FC, useCallback } from 'react';

import { Modal, Title } from '@patternfly/react-core';
import { useNMStateTranslation } from '@utils/hooks/useNMStateTranslation';

import { useDrawerContext } from '../../contexts/DrawerContext';

import InterfaceDrawerDetailsTab from './InterfaceDrawerDetailsTab';
import InterfaceDrawerYAMLTab from './InterfaceDrawerYAMLTab';

const InterfaceDrawer: FC = () => {
  const { t } = useNMStateTranslation();
  const { selectedInterface, setSelectedInterface } = useDrawerContext();

  const onClose = useCallback(() => {
    setSelectedInterface(null);
  }, []);

  const Tabs = [
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

  const selectedTab = location.hash.replace('#', '') || Tabs?.[0]?.id;

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
    >
      <div className="co-m-horizontal-nav pf-u-px-md">
        <ul className="co-m-horizontal-nav__menu">
          {Tabs.map((tab) => (
            <li
              key={tab.id}
              className={`co-m-horizontal-nav__menu-item ${
                selectedTab === tab.id ? 'co-m-horizontal-nav-item--active' : ''
              }`}
            >
              <a data-test-id="horizontal-link-Details" href={`${location.pathname}#${tab.id}`}>
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
