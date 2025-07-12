import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable, tap } from "rxjs";

export class ApiRequestTrackerInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    console.log(`[API] Request started: ${req.method} ${req.url}`);

    return next.handle(req).pipe(
      tap(event => {
        if (event.type === HttpEventType.UploadProgress) {
        // this.progress = Math.round(100 * (event.loaded / (event.total || 1)));
        // console.log(`Upload progress: ${this.progress}%`);
      } else if (event.type === HttpEventType.Response) {
        console.log('Upload complete!', event.body);
        // this.progress = 100;
      }
      })
    );
  }
}