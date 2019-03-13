export class Notifications {
    constructor(
      public eventType:        string,
      public description:      string,
      public createDateTime:   string,
      public updateDateTime:   string,
      public isDeleted:        string,
      id?:                     number
    ) {}
  }
  