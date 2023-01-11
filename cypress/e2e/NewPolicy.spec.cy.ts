import { TIMEOUT_VISIT_PAGE } from '../support/utilts';

describe('Create new policy with form', () => {
  it('with bridge interface', () => {
    const testPolicyName = 'test-bridge-policy-name';
    cy.visit('/k8s/cluster/nmstate.io~v1~NodeNetworkConfigurationPolicy');

    cy.contains('button[type="button"]', 'Create', { timeout: TIMEOUT_VISIT_PAGE }).click();

    cy.contains('button', 'From Form').click();

    cy.contains('h1', 'Create node network configuration policy', { matchCase: false });

    cy.get('input[name="policy-name"]').clear().type(testPolicyName);

    cy.get('input[name="policy-description"]').clear().type('test-policy-description');

    cy.get('input#policy-interface-port-0').type('eth0');
    cy.get('input#policy-interface-ip-0').check();

    cy.contains('button', 'Create').click();

    cy.contains('h1', testPolicyName, { timeout: TIMEOUT_VISIT_PAGE });
  });

  it('with bridge and bond interface', () => {
    const testPolicyName = 'test-bridge-bond-policy-name';
    cy.visit('/k8s/cluster/nmstate.io~v1~NodeNetworkConfigurationPolicy');

    cy.contains('button[type="button"]', 'Create', { timeout: TIMEOUT_VISIT_PAGE }).click();

    cy.contains('button', 'From Form').click();

    cy.contains('h1', 'Create node network configuration policy', { matchCase: false });

    cy.get('input[name="policy-name"]').clear().type(testPolicyName);

    cy.get('input[name="policy-description"]').clear().type('test-policy-description');

    cy.get('input#policy-interface-port-0').type('eth0');
    cy.get('input#policy-interface-ip-0').check();

    cy.contains('button', 'Add another interface to the policy', { matchCase: false }).click();

    cy.get('button#policy-interface-type-0').click();
    cy.contains('button', 'Bonding').click();

    cy.get('input#policy-interface-port-0').type('eth1');

    cy.contains('button', 'Create').click();

    cy.contains('h1', testPolicyName, { timeout: TIMEOUT_VISIT_PAGE });
  });
});
