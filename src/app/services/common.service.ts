import { Injectable } from '@angular/core';
import { UserModel } from '../model/user-model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.baseUrl;

  getUsers(): Observable<UserModel[]> {
    let url = this.baseUrl + 'GetUser';
    return this.http.get<UserModel[]>(url);
  }

  getUserById(Id: number): Observable<UserModel> {
    let url = this.baseUrl + 'User/' + Id;
    return this.http.get<UserModel>(url);
  }

  addUser(model: UserModel): Observable<object> {
    let url = this.baseUrl + 'AddUser';
    return this.http.post(url, model);
  }

  updateUser(model: UserModel): Observable<object> {
    let url = this.baseUrl + 'UpdateUser';
    return this.http.post(url, model);
  }

  deleteUser(Id: number): Observable<object> {
    let url = this.baseUrl + 'DeleteUser/' + Id;
    return this.http.delete(url);
  }
}
