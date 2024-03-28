import {
  EXPAND_INTERFACE_INFO,
  EXPAND_INTERFACES_LIST_TEST_ID,
  INTERFACE_DRAWER_TEST_ID,
  LLDP_DRAWER_DETAILS_SECTION_TEST_ID,
  LLDP_ENABLED_FILTER,
  ROW_FILTERS_BUTTON,
  SEARCH_FILTER_DROPDOWN,
} from '../support/selectors';

describe('NodeNetworkState list', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Empty state', () => {
    cy.intercept('GET', '/api/kubernetes/apis/nmstate.io/v1beta1/nodenetworkstates*', {
      fixture: 'NodeNetworkStatusEmpty.json',
    }).as('getStatuses');

    cy.visit('/k8s/cluster/nmstate.io~v1beta1~NodeNetworkState');

    cy.wait(['@getStatuses'], { timeout: 40000 });

    cy.get('h5').should('contain', 'No NodeNetworkStates found');
  });

  it('with one VID instace ', () => {
    cy.intercept('GET', '/api/kubernetes/apis/nmstate.io/v1beta1/nodenetworkstates*', {
      fixture: 'NodeNetworkStatusWithVID.json',
    }).as('getStatuses');

    cy.fixture('NodeNetworkStatusWithVID.json').then((nnsResponse) => {
      const nns = nnsResponse.items[0];
      const iface = nns.status.currentState.interfaces[0];

      cy.visit('/k8s/cluster/nmstate.io~v1beta1~NodeNetworkState');

      cy.wait(['@getStatuses'], { timeout: 40000 });

      cy.get('table').should('contain', nns.metadata.name);

      cy.get(EXPAND_INTERFACES_LIST_TEST_ID).click();
      cy.byTestID(EXPAND_INTERFACE_INFO).find('button').click();

      cy.byTestID(`${iface.type}-${iface.name}-open-drawer`).contains(iface.name).click();

      cy.byTestID(INTERFACE_DRAWER_TEST_ID).should('be.visible').should('contain', 'Details');

      cy.byTestID(LLDP_DRAWER_DETAILS_SECTION_TEST_ID)
        .should('contain', 'LLDP')
        .should('contain', 'Enabled');
    });
  });

  it('with LLDP informations ', () => {
    cy.intercept('GET', '/api/kubernetes/apis/nmstate.io/v1beta1/nodenetworkstates*', {
      fixture: 'NodeNetworkStatusWithLLDP.json',
    }).as('getStatuses');

    cy.fixture('NodeNetworkStatusWithLLDP.json').then((nnsResponse) => {
      const nns = nnsResponse.items[0];
      const iface = nns.status.currentState.interfaces.find((iface) => iface.lldp?.enabled);

      cy.visit('/k8s/cluster/nmstate.io~v1beta1~NodeNetworkState');

      cy.wait(['@getStatuses'], { timeout: 40000 });

      cy.get('table').should('contain', nns.metadata.name);

      cy.get(EXPAND_INTERFACES_LIST_TEST_ID).click();
      cy.byTestID(EXPAND_INTERFACE_INFO).find('button').click();

      cy.byTestID(`${iface.type}-${iface.name}-open-drawer`).contains(iface.name).click();

      cy.byTestID(INTERFACE_DRAWER_TEST_ID).should('be.visible').should('contain', 'Details');

      cy.byTestID(LLDP_DRAWER_DETAILS_SECTION_TEST_ID)
        .should('contain', 'LLDP')
        .should('contain', 'Enabled');

      cy.byTestID(LLDP_DRAWER_DETAILS_SECTION_TEST_ID)
        .should('contain', 'Neighbors')
        .should('contain', 'MAC address')
        .should('contain', 'Port')
        .should('contain', 'VLANS');
    });
  });

  it('filter by lldp', () => {
    cy.intercept('GET', '/api/kubernetes/apis/nmstate.io/v1beta1/nodenetworkstates*', {
      fixture: 'NodeNetworkStatusWithLLDP.json',
    }).as('getStatuses');

    cy.fixture('NodeNetworkStatusWithLLDP.json').then((nnsResponse) => {
      const nns = nnsResponse.items[0];
      const ifaceWithLLDP = nns.status.currentState.interfaces.find((iface) => iface.lldp?.enabled);
      const ifaceWithoutLLDP = nns.status.currentState.interfaces.find(
        (iface) => !iface.lldp?.enabled,
      );

      cy.visit('/k8s/cluster/nmstate.io~v1beta1~NodeNetworkState');

      cy.wait(['@getStatuses'], { timeout: 40000 });

      cy.get('table').should('contain', nns.metadata.name);

      // open filter toolbar
      cy.get(ROW_FILTERS_BUTTON).click();

      cy.get(LLDP_ENABLED_FILTER).check();

      // close filter toolbar
      cy.get(ROW_FILTERS_BUTTON).click();

      cy.get('table').should('contain', nns.metadata.name);
      cy.get(EXPAND_INTERFACES_LIST_TEST_ID).click();
      cy.byTestID(EXPAND_INTERFACE_INFO).find('button').click();

      cy.byTestID(`${ifaceWithLLDP.type}-${ifaceWithLLDP.name}-open-drawer`).contains(
        ifaceWithLLDP.name,
      );

      cy.byTestID(`${ifaceWithoutLLDP.type}-expandable-section-toggle`).should('not.exist');
    });
  });

  it('search by lldp vlan ID', () => {
    cy.intercept('GET', '/api/kubernetes/apis/nmstate.io/v1beta1/nodenetworkstates*', {
      fixture: 'NodeNetworkStatusWithLLDP.json',
    }).as('getStatuses');

    cy.fixture('NodeNetworkStatusWithLLDP.json').then((nnsResponse) => {
      const nns = nnsResponse.items[0];
      const ifaceWithLLDP = nns.status.currentState.interfaces.find((iface) => iface.lldp?.enabled);
      const ifaceWithoutLLDP = nns.status.currentState.interfaces.find(
        (iface) => !iface.lldp?.enabled,
      );

      const VLAN_NAME = '1000';

      cy.visit('/k8s/cluster/nmstate.io~v1beta1~NodeNetworkState');

      cy.wait(['@getStatuses'], { timeout: 40000 });

      cy.get('table').should('contain', nns.metadata.name);

      cy.get(SEARCH_FILTER_DROPDOWN).click();

      cy.get('#filter-toolbar button').contains('LLDP VLAN name').click();

      cy.get('input[data-test-id="item-filter"]').type(VLAN_NAME);

      cy.get('table').should('contain', nns.metadata.name);
      cy.get(EXPAND_INTERFACES_LIST_TEST_ID).click();
      cy.byTestID(EXPAND_INTERFACE_INFO).find('button').click();

      cy.byTestID(`${ifaceWithLLDP.type}-${ifaceWithLLDP.name}-open-drawer`).contains(
        ifaceWithLLDP.name,
      );

      cy.byTestID(`${ifaceWithoutLLDP.type}-expandable-section-toggle`).should('not.exist');
    });
  });

  it('search by lldp system name', () => {
    cy.intercept('GET', '/api/kubernetes/apis/nmstate.io/v1beta1/nodenetworkstates*', {
      fixture: 'NodeNetworkStatusWithLLDP.json',
    }).as('getStatuses');

    cy.fixture('NodeNetworkStatusWithLLDP.json').then((nnsResponse) => {
      const nns = nnsResponse.items[0];
      const ifaceWithLLDP = nns.status.currentState.interfaces.find((iface) => iface.lldp?.enabled);
      const ifaceWithoutLLDP = nns.status.currentState.interfaces.find(
        (iface) => !iface.lldp?.enabled,
      );

      const SYSTEM_NAME = 'sw01-access-f1.tlv2.redhat.com';

      cy.visit('/k8s/cluster/nmstate.io~v1beta1~NodeNetworkState');

      cy.wait(['@getStatuses'], { timeout: 40000 });

      cy.get('table').should('contain', nns.metadata.name);

      cy.get(SEARCH_FILTER_DROPDOWN).click();

      cy.get('#filter-toolbar button').contains('LLDP system name').click();

      cy.get('input[data-test-id="item-filter"]').type(SYSTEM_NAME);

      cy.get('table').should('contain', nns.metadata.name);
      cy.get(EXPAND_INTERFACES_LIST_TEST_ID).click();
      cy.byTestID(EXPAND_INTERFACE_INFO).find('button').click();

      cy.byTestID(`${ifaceWithLLDP.type}-${ifaceWithLLDP.name}-open-drawer`).contains(
        ifaceWithLLDP.name,
      );

      cy.byTestID(`${ifaceWithoutLLDP.type}-expandable-section-toggle`).should('not.exist');
    });
  });
});
