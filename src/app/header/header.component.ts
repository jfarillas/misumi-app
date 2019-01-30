import { 
  Component, 
  OnInit, 
  OnChanges, 
  ChangeDetectionStrategy, 
  Output, 
  Input, 
  EventEmitter, 
  SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { DataService } from './../shared/data.service';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnChanges {

  @Input() newTitle: string;
  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
  customerNameObj = new BehaviorSubject(null);
  titleName: string;
  userName: string;

  constructor(
    private dataService: DataService,
    public router: Router
  ) { 
    this.getLoggedInName.subscribe((name: string) => this.changeName(name));
    this.getLoggedInName.emit(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    switch (this.router.url) {
      case '/customers' || '/':
        this.customerNameObj.next('Customers');
        this.titleName = this.customerNameObj.getValue();
      break;
      case '/new-customer':
        this.customerNameObj.next('Create New Customer');
        this.titleName = this.customerNameObj.getValue();
      break;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes.newTitle.currentValue);
    this.titleName = changes.newTitle.currentValue;
  }
  
  changeName(name: string) {
    this.userName = name;
    console.log(this.userName);
    return this.userName;
  }

}
