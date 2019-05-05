export class PasswordReset {
    constructor(
      public name:     string,
      public password: string,
      public email:    string,
      id?:             number
    ) {}
  }
  