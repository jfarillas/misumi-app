import { Component, 
  OnInit, 
  OnChanges, 
  Input,
  Output, 
  SimpleChanges, 
  ChangeDetectionStrategy,
  EventEmitter,
  ChangeDetectorRef 
} from '@angular/core';
import { Observable } from 'rxjs';

import { DataService, Country } from './../../shared/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnChanges {

  @Input() getCustomer: any;
  @Output() changeCountry: EventEmitter<any> = new EventEmitter();
  customer: any;
  countries: Country[] = [];
  country: any;

  // Bar charts for financial status
  barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  barChartLabels:string[] = ['2018', '2019'];
  barChartType:string = 'bar';
  barChartLegend:boolean = true;
 
  barChartData:any[] = [
    {data: [1234, 1234], label: 'Sales'},
    {data: [1000, 678], label: 'Payment'}
  ];

  chartColors: Array<any> = [
    { // first color
      backgroundColor: '#2b8bd9',
      borderColor: '#2b8bd9',
      pointBackgroundColor: '#2b8bd9',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#2b8bd9'
    },
    { // second color
      backgroundColor: '#ff7b00',
      borderColor: '#ff7b00',
      pointBackgroundColor: '#ff7b00',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#ff7b00'
    }];
 
  constructor(
    private dataService: DataService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changing...');
    console.log(changes.getCustomer.currentValue);

    // Country filters
    this.dataService.getCountries().subscribe(countries => {
      console.log(countries);
      let selectedCountry = countries.find((country: { code: any; name: any; }) => country.code === changes.getCustomer.currentValue.country);
      this.country = selectedCountry.name;
      // Check if the country field has been changed
      this.ref.detectChanges();
      console.log(this.country);
    });

    this.customer = changes.getCustomer.currentValue;
  }

  // Financial status events
  chartClicked(e:any):void {
    console.log(e);
  }
 
  chartHovered(e:any):void {
    console.log(e);
  }

}
