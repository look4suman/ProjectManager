import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewTaskComponent } from './view-task/view-task.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { AddUserComponent } from './add-user/add-user.component';

const routes: Routes = [
  { path: 'addproject', component: AddProjectComponent },
  { path: 'addtask', component: AddTaskComponent },
  { path: 'adduser', component: AddUserComponent },
  { path: '', component: ViewTaskComponent },
  { path: '**', component: ViewTaskComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
