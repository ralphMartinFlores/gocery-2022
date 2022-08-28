import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  productId: any
  SharedData: any
  acc_info: any = {};
  cart_content: any = {};
  baseURL: string = "http://localhost/itelective5project/api/";
  constructor(private http: HttpClient) { }

  private subject = new Subject<any>();

  sendUpdate(message: string) {
    this.subject.next({ text: message });
  }

  getUpdate(): Observable<any> {
    return this.subject.asObservable();
  }

  sendApiRequest(method: any, data: any) {
    return <any>(
      this.http.post(this.baseURL + method, btoa(JSON.stringify(data)))
    );
  }

  sendApiRequest2(method: string, data: any, condition: string) {
    return <any>(
      this.http.post(this.baseURL + method + condition, btoa(JSON.stringify(data)))
    );
  }
}
