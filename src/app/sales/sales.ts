export class Sales {
    constructor(
      public picName:          string,
      public picContact:       string,
      public gender:           string,
      public status:           string,
      public customersId:      number,
      public paymentTerms:     string,
      public remarks:          string,
      public invoicesRef:      string,
      public invoices:         string,
      public payments:         string,
      public cost:             string,
      public profit:           string,
      public lost:             string,
      id?:                     number
    ) {}
  }
  