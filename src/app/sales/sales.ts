export class Sales {
    constructor(
      public customersId:      string,
      public accountsId:       string,
      public invoices:         string,
      public amount:           string,
      public paymentDate:      string,
      public paymentDateYear:  string,
      public paymentDateMonth: string,
      public paymentDateDay:   string,
      public isEnabled:        number,
      id?:                     number
    ) {}
  }
  