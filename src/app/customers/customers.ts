export class Customers {
    constructor(
      public customerKey:       string,
      public name:              string,
      public businessRegNo:     string,
      public registrationDate:  any,
      public regDateYear:       string,
      public regDateMonth:      string,
      public regDateDay:        string,
      public streetName:        string,
      public buildingName:      string,
      public unitNo:            string,
      public postalCode:        string,
      public country:           string,
      public bankAccountNo:     string,
      public contactNo:         string,
      public contactName:       string,
      public email:             string,
      public faxNo:             string,
      public contactMisc:       string,
      public gender:            string,
      public origin:            string,
      public salesDetails:      string,
      public paymentDetails:    string,
      public bankingDetails:    string,
      public miscDetails:       string,
      public status:            string,
      public remarks:           string,
      id?:         number
    ) {}
  }
  