import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { ViewTaskComponent } from './view-task/view-task.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { ProjectSearchComponent } from './project-search/project-search.component';
import { ParentTaskSearchComponent } from './parent-task-search/parent-task-search.component';
import { MenuComponent } from './menu/menu.component';
import { FilterPipe } from './pipes/filter.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    AddTaskComponent,
    AddUserComponent,
    AddProjectComponent,
    ViewTaskComponent,
    UserSearchComponent,
    ProjectSearchComponent,
    ParentTaskSearchComponent,
    MenuComponent,
    FilterPipe,
    SortPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule
  ],
  entryComponents: [UserSearchComponent, ProjectSearchComponent, ParentTaskSearchComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
