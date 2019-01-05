import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserComponent } from './add-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { SortPipe } from '../pipes/sort.pipe';
import { FilterPipe } from '../pipes/filter.pipe';

describe('AddUserComponent', () => {
    let component: AddUserComponent;
    let fixture: ComponentFixture<AddUserComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, HttpClientModule, RouterModule, RouterTestingModule, FormsModule],
            declarations: [AddUserComponent, SortPipe, FilterPipe]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('form invalid when empty', () => {
        expect(component.addUserForm.valid).toBeFalsy();
    });

    it('First Name validity', () => {
        const firstName = component.addUserForm.controls['FirstName'];
        expect(firstName.valid).toBeFalsy();
    });

    it('Last Name validity', () => {
        const lastName = component.addUserForm.controls['LastName'];
        expect(lastName.valid).toBeFalsy();
    });

    it('Employee Id validity', () => {
        const employeeId = component.addUserForm.controls['EmployeeId'];
        expect(employeeId.valid).toBeFalsy();
    });

    it('form valid when not empty', () => {
        component.addUserForm.controls['FirstName'].setValue('first name');
        component.addUserForm.controls['LastName'].setValue('last name');
        component.addUserForm.controls['EmployeeId'].setValue('123');
        expect(component.addUserForm.valid).toBeTruthy();
    });

    it('form should be submitted', () => {
        component.onSubmit();
        expect(component.formSubmitted).toBeTruthy();
    });
});
