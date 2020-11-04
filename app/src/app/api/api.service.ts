import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {FormResponse} from "./form";

@Injectable()
export class ApiService {

  private _loading: boolean = false;

  constructor(private http: HttpClient) {}

  get loading(): boolean {
    return this._loading;
  }

  set loading(value: boolean) {
    this._loading = value;
  }

  getCarriers(): Observable<any> {
    return new Observable<any>((observer) => {
      this.http.get(`/api/carriers`).subscribe(
        data => observer.next(data),
        error => observer.next(error)
      )
    });
  }

  getForm(id: string): Observable<FormResponse> {
    return new Observable<any>((observer) => {
      this.http.get(`/api/carrier/${id}/form`).subscribe(
        data => observer.next(data as FormResponse),
        error => observer.next(error))
    });
  }

  submitForm(id: string, data: FormData): Observable<any> {
    return new Observable<any>((observer) => {
      this.http.post(`/api/carrier/${id}/submit`, data).subscribe(
        data => observer.next(data),
        error => observer.next(error))
    });
  }

  getSecret(id, secret: string): Observable<any> {
    return this.http.get(`/api/carrier/${id}/secret/${secret}`);
  }

  optionsReport(id, secret: string): Observable<any> {
    return this.http.options(`/api/carrier/${id}/report/${secret}`);
  }

  patchSecret(id, secret: string, action: string): Observable<any> {
    return new Observable<any>((observer) => {
      this.http.patch(`/api/carrier/${id}/secret/${secret}`, {action: action}).subscribe(
        data => observer.next(data),
        error => observer.next(error))
    });
  }

}
