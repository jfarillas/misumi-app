import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private headerComponent: HeaderComponent
  ) {
  }

  ngOnInit() {}

  convertCase(str: string) {
    var lower = String(str).toLowerCase();
    return lower.replace(/(^| )(\w)/g, function(x) {
      return x.toUpperCase();
    });
  }
}
