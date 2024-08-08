import React, { FC, ReactNode } from 'react';
import classnames from 'classnames';

import {
  Button,
  ButtonVariant,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTermHelpText,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';
import { useNMStateTranslation } from '@utils/hooks/useNMStateTranslation';

import { DetailItemHeader } from './DetailItemHeader';
import EditButtonWithTooltip from './EditButtonWithTooltip';

import './DetailItem.scss';

type DetailItemProps = {
  popoverBodyContent?: ReactNode;
  breadcrumb?: string;
  className?: string;
  testId?: string;
  description: ReactNode | string;
  header?: ReactNode;
  editOnTitleJustify?: boolean;
  isDisabled?: boolean;
  isEdit?: boolean;
  isPopover?: boolean;
  headerBadge?: ReactNode;
  messageOnDisabled?: string;
  moreInfoURL?: string;
  onEditClick?: () => void;
  showEditOnTitle?: boolean;
};

const DetailItem: FC<DetailItemProps> = ({
  popoverBodyContent,
  breadcrumb,
  className,
  testId,
  description,
  header,
  editOnTitleJustify = false,
  isDisabled,
  isEdit,
  isPopover,
  headerBadge,
  messageOnDisabled,
  moreInfoURL,
  onEditClick,
  showEditOnTitle,
}) => {
  const { t } = useNMStateTranslation();
  const NotAvailable = <span className="text-muted">{t('Not available')}</span>;

  return (
    <DescriptionListGroup className={classnames('pf-c-description-list__group', className)}>
      <DescriptionListTermHelpText className="pf-c-description-list__term">
        <Flex
          justifyContent={{
            default: editOnTitleJustify ? 'justifyContentSpaceBetween' : 'justifyContentFlexStart',
          }}
        >
          {(popoverBodyContent || breadcrumb || header || headerBadge || moreInfoURL) && (
            <FlexItem>
              <DetailItemHeader
                bodyContent={popoverBodyContent}
                breadcrumb={breadcrumb}
                descriptionHeader={header}
                isPopover={isPopover}
                label={headerBadge}
                moreInfoURL={moreInfoURL}
              />
            </FlexItem>
          )}
          {isEdit && showEditOnTitle && (
            <FlexItem>
              <Button
                data-test-id={`${testId}-edit`}
                isDisabled={isDisabled}
                isInline
                onClick={onEditClick}
                variant={ButtonVariant.link}
              >
                {t('Edit')}
                <PencilAltIcon className="co-icon-space-l pf-v5-c-button-icon--plain" />
              </Button>
            </FlexItem>
          )}
        </Flex>
      </DescriptionListTermHelpText>

      <DescriptionListDescription
        className="pf-c-description-list__description"
        data-test-id={testId}
      >
        {isEdit && !showEditOnTitle ? (
          <EditButtonWithTooltip
            isEditable={!isDisabled}
            onEditClick={onEditClick}
            testId={testId}
            tooltipContent={messageOnDisabled}
          >
            {description ?? NotAvailable}
          </EditButtonWithTooltip>
        ) : (
          description
        )}
      </DescriptionListDescription>
    </DescriptionListGroup>
  );
};

export default DetailItem;
