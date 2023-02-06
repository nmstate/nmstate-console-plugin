/// <reference types="cypress" />

import { KUBEADMIN_IDP, KUBEADMIN_USERNAME, TIMEOUT_VISIT_PAGE } from './constants';

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

const submitButton = 'button[type=submit]';

Cypress.Commands.add('login', (provider?: string, username?: string, password?: string) => {
  // Check if auth is disabled (for a local development environment).

  cy.visit('', { timeout: TIMEOUT_VISIT_PAGE }); // visits baseUrl which is set in plugins.js
  cy.window().then((win: any) => {
    if (win.SERVER_FLAGS?.authDisabled) {
      cy.task('log', '  skipping login, console is running with auth disabled');
      return;
    }

    cy.clearCookie('openshift-session-token');
    cy.clearCookies({ domain: `.${win.location.domain}` });

    const idp = provider || KUBEADMIN_IDP;

    cy.get('.pf-c-login__main-body', { timeout: TIMEOUT_VISIT_PAGE }).should('be.visible');

    cy.get('body').then(($body) => {
      if ($body.text().includes(idp)) {
        cy.contains(idp).should('be.visible').click();
      }
    });

    cy.get('#inputUsername').type(username || KUBEADMIN_USERNAME);
    cy.get('#inputPassword').type(password || Cypress.env('KUBEADMIN_PASSWORD'));
    cy.get(submitButton).click();
    // wait for virtualization page

    cy.contains('.pf-c-nav__link', 'Networking', {
      timeout: TIMEOUT_VISIT_PAGE,
    }).click();
    cy.contains('.pf-c-nav__link', 'NodeNetworkConfigurationPolicy').should('be.visible');
    cy.clearCookies({ domain: `.${win.location.domain}` });
  });
});

Cypress.Commands.add('logout', () => {
  // Check if auth is disabled (for a local development environment).
  cy.window().then((win: any) => {
    if (win.SERVER_FLAGS?.authDisabled) {
      cy.task('log', '  skipping logout, console is running with auth disabled');
      return;
    }
    cy.task('log', '  Logging out');
    cy.byTestID('user-dropdown').click();
    cy.byTestID('log-out').should('be.visible');
    cy.byTestID('log-out').click({ force: true });
    cy.byLegacyTestID('login').should('be.visible');
  });
});
