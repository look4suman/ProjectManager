import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentTaskSearchComponent } from './parent-task-search.component';

describe('ParentTaskSearchComponent', () => {
  let component: ParentTaskSearchComponent;
  let fixture: ComponentFixture<ParentTaskSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentTaskSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentTaskSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
