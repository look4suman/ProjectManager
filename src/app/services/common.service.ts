import { Injectable } from '@angular/core';
import { UserModel } from '../model/user-model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ProjectModel } from '../model/project-model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.baseUrl;

  GetUsers(): Observable<UserModel[]> {
    let url = this.baseUrl + 'GetUser';
    return this.http.get<UserModel[]>(url);
  }

  GetUserById(Id: number): Observable<UserModel> {
    let url = this.baseUrl + 'User/' + Id;
    return this.http.get<UserModel>(url);
  }

  AddUser(model: UserModel): Observable<object> {
    let url = this.baseUrl + 'AddUser';
    return this.http.post(url, model);
  }

  UpdateUser(model: UserModel): Observable<object> {
    let url = this.baseUrl + 'UpdateUser';
    return this.http.post(url, model);
  }

  DeleteUser(Id: number): Observable<object> {
    let url = this.baseUrl + 'DeleteUser/' + Id;
    return this.http.delete(url);
  }

  GetProjects(): Observable<ProjectModel[]> {
    let url = this.baseUrl + 'GetProject';
    return this.http.get<ProjectModel[]>(url);
  }

  AddProject(model: ProjectModel): Observable<object> {
    let url = this.baseUrl + 'AddProject';
    return this.http.post(url, model);
  }

  UpdateProject(model: ProjectModel): Observable<object> {
    let url = this.baseUrl + 'UpdateProject';
    return this.http.post(url, model);
  }

  EndProject(model: ProjectModel): Observable<object> {
    let url = this.baseUrl + 'EndProject';
    return this.http.put(url, model);
  }
}
