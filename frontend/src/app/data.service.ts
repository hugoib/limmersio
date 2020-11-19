import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import {  throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = 'http://0.0.0.0:5000/limmersify';
  // Change here for deployment on the AWS Environment
  // private REST_API_SERVER = 'http://0.0.0.0:5000/limmersify';

  constructor(private httpClient: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  public sendGetRequest(request) {
    return this.httpClient.get(this.REST_API_SERVER, {
      params: {
        text: request.text,
        level: request.level,
        target_language: request.target_language,
        'Access-Control-Allow-Origin': '*'
      },
      observe: 'response'
    }).pipe(retry(2), catchError(this.handleError), tap(res => {
    }));
}

}

