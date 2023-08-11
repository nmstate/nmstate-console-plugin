import {
  EXPAND_INTERFACE_INFO,
  EXPAND_INTERFACES_LIST_TEST_ID,
  INTERFACE_DRAWER_TEST_ID,
  LLDP_DRAWER_DETAILS_SECTION_TEST_ID,
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

    cy.get('.pf-c-empty-state').should('contain', 'No NodeNetworkStates found');
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
});
