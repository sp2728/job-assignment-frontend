import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  localStorageSubject = new Subject();

  constructor(private http:HttpClient) { 
    if(localStorage.getItem('userId')){ this.localStorageSubject.next(true)}
    else this.localStorageSubject.next(false);
  }

  registerUser(bodyData){
    const user = new User(bodyData.name, bodyData.userId);
    
    return this.http.post(environment.backendUrl+'/register', user)
    .pipe(
      map((response: any)=>{
        return response;
      })
    )
    .toPromise();
  }

  authenticateUser(bodyData){
    return this.http.post(environment.backendUrl+'/login', bodyData)
    .pipe(
      map((response: any)=>{
        this.setLocalStorageID(bodyData.userId);
        return response;
      })
    )
    .toPromise();
  }

  getChartData(){
    return this.http.get(environment.backendUrl+ '/chart')
    .pipe(
      map((response: any)=>{
        return response;
      })
    )
    .toPromise();
  }

  recordAction(userId){
    return this.http.post(environment.backendUrl+'/clickTime', {userId})
    .pipe(
      map((response: any)=>{
        return response;
      })
    )
    .toPromise();
  }

  setLocalStorageID(userId){
    localStorage.setItem('userId', userId);
    this.localStorageSubject.next(true);
  }

  getLocalStorageID(){
    return this.localStorageSubject.asObservable();
  }

  logout(){
    localStorage.removeItem('userId');
    this.localStorageSubject.next(false);
  }
}
