import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiServicService {

  // baseURL:string = "https://deliverytracker-az2r.onrender.com";

  baseURL:string = "https://deliveryapp-474910.el.r.appspot.com";
    // baseURL:string = "http://localhost:8080";


  constructor(private http: HttpClient) { 
  }

  getUserByMobileNumber(mobileNumber:string): Observable<any> {
    return this.http.get(this.baseURL + `/user/getUserByMobileNumber/${mobileNumber}`);
  }

  getOrderByStatusAndUserId(apiUrl:string,orderStatus:string,userId:number): Observable<any> {
    return this.http.get(this.baseURL + `/order/${apiUrl}/${orderStatus}/${userId}`);
  }

  getAllOrderByUserId(userId:number): Observable<any> {
    return this.http.get(this.baseURL + `/order/getAllOrderByUserId/${userId}`);
  }

  listUser(): Observable<any> {
    return this.http.get(this.baseURL + `/user/listUser`);
  }

  addOrder(order:any): Observable<any> {
    return this.http.post(this.baseURL + `/order/addOrder`,order);
  }

  deliverOrder(order:any): Observable<any> {
    return this.http.post(this.baseURL + `/order/deliverOrder`,order);
  }

  bulkUpload(apiUrl:string,order:any):Observable<any>{
    return this.http.post(this.baseURL + apiUrl,order, {responseType: 'text'});
  }

}
