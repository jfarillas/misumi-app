export class Accounts {
  constructor(
    public designation: string,
    public email:       string,
    public password:    string,
    public name:        string,
    public contactNo:   string,
    public parentId:    number,
    id?:                number
  ) {}
}
