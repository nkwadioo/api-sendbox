import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, of, throwError, zip } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  response = 'No data'
  title = 'api-sandbox';

  constructor(private http: HttpClient) {
    const requests: Observable<Object>[] = [];
    for(let i = 0; i < 50; i++) {
      const num = Math.floor(Math.random() * 4)+1;
      requests.push(this.httpRequest(`v${num}`))
    }
    zip(...requests).subscribe({
      next: (res) => {
        this.response = JSON.stringify(res);
        console.log('success', res)
      }, error: (err) => {
        this.response = 'Error'
        console.log('error', err)
      }, complete: () => console.log('done')
    })
  }

  httpRequest(version = 'v1') {
    return this.http.post(`/api/users/${version}`, {data: 'some data'}).pipe(
      catchError(err => of({error: 'wrong request', err }))
    )
  }
}
