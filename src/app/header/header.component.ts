import { Component, OnInit, OnChanges, ChangeDetectionStrategy, Output, Input, EventEmitter, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DataService } from './../shared/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnChanges {

  @Input() newTitle: string;
  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
  customerNameObj = new BehaviorSubject('Customers');
  titleName: string;
  userName: string;

  constructor(
    private dataService: DataService
  ) { 
    this.getLoggedInName.subscribe((name: string) => this.changeName(name));
    this.getLoggedInName.emit(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.titleName = this.customerNameObj.getValue();
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
