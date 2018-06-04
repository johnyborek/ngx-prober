import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './testing-app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
