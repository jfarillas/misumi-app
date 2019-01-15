import { TestBed, async } from '@angular/core/testing';
import { AccountsComponent } from './accounts.component';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountsComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AccountsComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'accounts'`, async(() => {
    const fixture = TestBed.createComponent(AccountsComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('accounts');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AccountsComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('User accounts');
  }));
});
