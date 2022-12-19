describe('Create new policy with form', () => {
  it('with bridge interface', () => {
    const testPolicyName = 'test-policy-name';
    cy.visit('/k8s/cluster/nmstate.io~v1~NodeNetworkConfigurationPolicy');

    cy.contains('button[type="button"]', 'Create').click();

    cy.contains('button', 'From Form').click();

    cy.contains('h1', 'Create node network configuration policy', { matchCase: false });

    cy.get('input[name="policy-name"]').clear().type(testPolicyName);

    cy.get('input[name="policy-description"]').clear().type('test-policy-description');

    cy.get('input#policy-interface-port-0').type('eth0');
    cy.get('input#policy-interface-ip-0').check();

    cy.contains('button', 'Create').click();

    cy.contains('h1', testPolicyName);
  });
});
