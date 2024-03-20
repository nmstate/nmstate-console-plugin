const deletePolicyFromDetailsPage = (policyName: string) => {
  cy.contains('button', 'Actions', { matchCase: false }).click();
  cy.contains('button', 'Delete').click();

  cy.contains('button[disabled]', 'Delete');

  cy.get('input#text-confirmation').clear().type(`${policyName}`);

  cy.contains('button', 'Delete').click();

  cy.contains('h1', 'NodeNetworkConfigurationPolicy');
};

describe('Create new policy with form', () => {
  beforeEach(() => {
    cy.login();
  });

  it('with bridge interface', () => {
    const testPolicyName = 'test-bridge-policy-name';
    cy.visit('/k8s/cluster/nmstate.io~v1~NodeNetworkConfigurationPolicy');
    cy.contains('button[type="button"]', 'Create').click();

    cy.contains('button', 'From Form').click();

    cy.contains('h1', 'Create NodeNetworkConfigurationPolicy', { matchCase: false });

    cy.get('input[name="policy-name"]').clear().type(`${testPolicyName}`);

    cy.get('input[name="policy-description"]').clear().type('test-policy-description');

    cy.get('input#policy-interface-port-0').type('eth0');
    cy.get('input#policy-interface-ip-0').check();

    cy.contains('button', 'Create').click();

    cy.contains('h1', testPolicyName);

    deletePolicyFromDetailsPage(testPolicyName);
  });

  it('with bridge and bond interface', () => {
    const testPolicyName = 'test-bridge-bond-policy-name';
    cy.visit('/k8s/cluster/nmstate.io~v1~NodeNetworkConfigurationPolicy');
    cy.contains('button[type="button"]', 'Create').click();

    cy.contains('button', 'From Form').click();

    cy.contains('h1', 'Create NodeNetworkConfigurationPolicy', { matchCase: false });

    cy.get('input[name="policy-name"]').clear().type(`${testPolicyName}`);

    cy.get('input[name="policy-description"]').clear().type('test-policy-description');

    cy.get('input#policy-interface-port-0').type('eth0');
    cy.get('input#policy-interface-ip-0').check();

    cy.contains('button', 'Add another interface to the policy', { matchCase: false }).click();

    cy.get('#policy-interface-type-0').select('bond');

    cy.get('input#policy-interface-port-0').type('eth1');

    cy.contains('button', 'Create').click();

    cy.contains('h1', testPolicyName);

    deletePolicyFromDetailsPage(testPolicyName);
  });
});
