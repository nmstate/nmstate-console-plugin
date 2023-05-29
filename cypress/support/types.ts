export type ConsoleWindowType = Cypress.AUTWindow & {
  SERVER_FLAGS?: {
    authDisabled?: boolean;
  };
};
