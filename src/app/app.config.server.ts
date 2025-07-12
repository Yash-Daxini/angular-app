import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { ApiService } from './services/api.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiRequestTrackerInterceptor } from './interceptors/api-request-tracker-interceptor';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiRequestTrackerInterceptor,
      multi: true
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
