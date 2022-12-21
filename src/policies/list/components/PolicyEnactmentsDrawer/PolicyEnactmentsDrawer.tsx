import React, { useEffect, useMemo, useState } from 'react';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { RedExclamationCircleIcon } from '@openshift-console/dynamic-plugin-sdk';
import {
  ExpandableSection,
  Modal,
  Tab,
  Tabs,
  TabTitleIcon,
  TabTitleText,
} from '@patternfly/react-core';
import { CheckIcon, CloseIcon, HourglassHalfIcon, InProgressIcon } from '@patternfly/react-icons';
import { global_danger_color_200 as dangerColor } from '@patternfly/react-tokens/dist/js/global_danger_color_200';
import { global_success_color_200 as successColor } from '@patternfly/react-tokens/dist/js/global_success_color_200';
import { V1beta1NodeNetworkConfigurationEnactment, V1NodeNetworkConfigurationPolicy } from '@types';

import { categorizeEnactments, findConditionType } from '../utils';

import './policy-enactments-drawer.scss';

type PolicyEnactmentsDrawerProps = {
  selectedPolicy?: V1NodeNetworkConfigurationPolicy;
  onClose: () => void;
  enactments: V1beta1NodeNetworkConfigurationEnactment[];
};

const PolicyEnactmentsDrawer: React.FC<PolicyEnactmentsDrawerProps> = ({
  selectedPolicy,
  onClose,
  enactments,
}) => {
  const { t } = useNMStateTranslation();

  const {
    available: availableEnactments,
    pending: pendingEnactments,
    progressing: progressingEnactments,
    failing: failingEnactments,
    aborted: abortedEnactments,
  } = categorizeEnactments(enactments);

  const tabsData = useMemo(
    () => [
      { title: t('Failing'), icon: <RedExclamationCircleIcon />, enactments: failingEnactments },
      {
        title: t('Aborted'),
        icon: <CloseIcon color={dangerColor.value} />,
        enactments: abortedEnactments,
      },
      {
        title: t('Available'),
        icon: <CheckIcon color={successColor.value} />,
        enactments: availableEnactments,
      },
      { title: t('Progressing'), icon: <InProgressIcon />, enactments: progressingEnactments },
      { title: t('Pending'), icon: <HourglassHalfIcon />, enactments: pendingEnactments },
    ],
    [enactments],
  );

  const [selectedTab, setSelectedTab] = useState<string | number>(0);

  useEffect(() => {
    setSelectedTab(tabsData.findIndex((tab) => tab.enactments.length !== 0));
  }, [selectedPolicy]);

  return (
    <Modal
      aria-label="Template drawer"
      className="ocs-modal co-catalog-page__overlay co-catalog-page__overlay--right policy-enactments-drawer"
      isOpen={!!selectedPolicy}
      onClose={onClose}
      disableFocusTrap
      header={<h2>{t('Matched nodes summary')}</h2>}
    >
      <div className="modal-body modal-body-border modal-body-content">
        <Tabs
          activeKey={selectedTab}
          onSelect={(event, key) => setSelectedTab(key)}
          isBox
          aria-label={t('Enactments categorized by status')}
          role="region"
        >
          {tabsData.map((tabData, index) => (
            <Tab
              eventKey={index}
              key={tabData.title}
              isDisabled={tabData.enactments.length === 0}
              aria-label={t('Display all {{status}} enactments', { status: tabData.title })}
              title={
                <>
                  <TabTitleIcon>{tabData.icon}</TabTitleIcon>
                  <TabTitleText> {tabData.title} </TabTitleText>
                </>
              }
            >
              {tabData?.enactments?.map((enhactment) => (
                <ExpandableSection
                  toggleText={enhactment?.metadata?.name}
                  key={enhactment?.metadata?.name}
                >
                  <pre className="policy-enactments-drawer__tabs__expandable-content">
                    {findConditionType(enhactment?.status?.conditions, tabData.title)?.message}
                  </pre>
                </ExpandableSection>
              ))}
            </Tab>
          ))}
        </Tabs>
      </div>
    </Modal>
  );
};

export default PolicyEnactmentsDrawer;
