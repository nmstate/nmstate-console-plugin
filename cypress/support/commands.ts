/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />
import { KUBEADMIN_IDP, KUBEADMIN_USERNAME } from './constants';
import { ConsoleWindowType } from './types';

import Loggable = Cypress.Loggable;
import Timeoutable = Cypress.Timeoutable;
import Withinable = Cypress.Withinable;
import Shadow = Cypress.Shadow;

declare global {
  namespace Cypress {
    interface Chainable {
      login(provider?: string, username?: string, password?: string): Chainable<void>;
      logout(): Chainable<void>;
      byTestID(
        selector: string,
        options?: Partial<Loggable & Timeoutable & Withinable & Shadow>,
      ): Chainable;
      byLegacyTestID(selector: string): Chainable;
      clickOutside(): Chainable;
    }
  }
}

const submitButton = 'button[type=submit]';

Cypress.Commands.add('login', (provider, username, password) => {
  // Check if auth is disabled (for a local development environment).

  cy.visit(''); // visits baseUrl which is set in plugins.js
  cy.window().then((win: ConsoleWindowType) => {
    if (win.SERVER_FLAGS?.authDisabled) {
      cy.log('skipping login, console is running with auth disabled');

      cy.contains('li[data-test="nav"]', 'Networking').click();
      cy.contains('*[data-test-id="policy-nav-list"]', 'NodeNetworkConfigurationPolicy').should(
        'be.visible',
      );
      return;
    }

    cy.clearCookie('openshift-session-token');

    const idp = provider || KUBEADMIN_IDP;

    cy.get('main form').should('be.visible');

    cy.get('body').then(($body) => {
      if ($body.text().includes(idp)) {
        cy.contains(idp).should('be.visible').click();
      }
    });

    cy.get('#inputUsername').type(username || KUBEADMIN_USERNAME);
    cy.get('#inputPassword').type(password || Cypress.env('KUBEADMIN_PASSWORD'));
    cy.get(submitButton).click();
    // wait for virtualization page

    cy.contains('li[data-test="nav"]', 'Networking').click();
    cy.contains('*[data-test-id="policy-nav-list"]', 'NodeNetworkConfigurationPolicy').should(
      'be.visible',
    );
  });
});

Cypress.Commands.add('logout', () => {
  // Check if auth is disabled (for a local development environment).
  cy.window().then((win: ConsoleWindowType) => {
    if (win.SERVER_FLAGS?.authDisabled) {
      cy.log('skipping logout, console is running with auth disabled');
      return;
    }
    cy.log('Logging out');
    cy.byTestID('user-dropdown').click();
    cy.byTestID('log-out').should('be.visible');
    cy.byTestID('log-out').click({ force: true });
    cy.byLegacyTestID('login').should('be.visible');
  });
});

Cypress.Commands.add('byTestID', (selector, options) =>
  cy.get(`[data-test="${selector}"]`, options),
);

Cypress.Commands.add('byLegacyTestID', (selector) => cy.get(`[data-test-id="${selector}"]`));

Cypress.Commands.add('clickOutside', () => {
  return cy.get('body').click(0, 0); //0,0 here are the x and y coordinates
});
