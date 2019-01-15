export class Customers {
    constructor(
      public customerKey:       string,
      public name:              string,
      public businessRegNo:     string,
      public registrationDate:  string,
      public address:           string,
      public country:           string,
      public bankAccountNo:     string,
      public contactNo:         string,
      public status:            string,
      public remarks:           string,
      id?:         number
    ) {}
  }
  