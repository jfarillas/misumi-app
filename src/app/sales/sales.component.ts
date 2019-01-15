import { Component, OnInit } from '@angular/core';
import { Sales } from './sales';
import { SalesService } from './_services/sales.service';
@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  sales: Sales[];
  error = '';
  success = '';
  sale = new Sales('', '', '', '', 0, '', '', '', '', '', '', '', '');
  constructor(private salesService: SalesService) {
  }
  ngOnInit() {
    //this.getSales();
  }
  /* getAccounts(): void {
    this.salesService.getAll().subscribe((res: Account[]) => {
      this.sales = res;
    }, (err) => {
      this.error = err;
    });
  } */
  addSales(f: {
    reset: () => void;
  }) {
    this.resetErrors();
    this.salesService.store(this.sale)
      .subscribe((res: Sales[]) => {
        // Update the list of sales
        this.sales = res;
        // Inform the user
        this.success = 'Created successfully';
        // Reset the form
        f.reset();
      }, (err) => this.error = err);
  }
  private resetErrors() {
    this.success = '';
    this.error = '';
  }
}
