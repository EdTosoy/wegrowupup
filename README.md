# Nx Angular + NestJS + Tailwind Starter Template

Clean Nx workspace for full-stack apps with Angular, NestJS, and Tailwind CSS. Uses modern Angular 17+ patterns with `httpResource` and a scalable library setup.

---

## Project Setup

### Create Workspace

```bash
npx create-nx-workspace@latest <project-name> --preset=ts --workspaces=false
```

### Add NestJS App

```bash
npx nx add @nx/nest
npx nx g @nx/nest:app apps/api
```

### Add Angular App

```bash
npx nx add @nx/angular
npx nx g @nx/angular:app apps/web
```

### Create Data Access Library

Use Nx CLI to generate a library for all API services:

```bash
npx nx g @nx/angular:lib data-access --directory=libs
```

This will create:

```
libs/data-access/src/lib/
```

You can add services and InjectionTokens here.

### Set Up Proxy

Create `apps/web/proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

Update `apps/web/project.json` under `targets.serve.options`:

```json
{
  "dependsOn": ["api:serve"],
  "proxyConfig": "apps/web/proxy.conf.json"
}
```

### Add Tailwind

```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

Create `.postcssrc.json` in the root:

```json
{  "plugins": { "@tailwindcss/postcss": {} } }
```

Import Tailwind in `apps/web/src/styles.css`:

```css
@import "tailwindcss";
```

---

## Data Access Library Example

### InjectionToken

```ts
// libs/data-access/src/lib/tokens/api-base.token.ts
import { InjectionToken } from '@angular/core';
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
```

### ApiClient Service

```ts
// libs/data-access/src/lib/api-client.service.ts
import { Injectable, inject } from '@angular/core';
import { API_BASE_URL } from './tokens/api-base.token';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  base = inject(API_BASE_URL);
}
```

### Domain Service Example

```ts
// libs/data-access/src/lib/users.service.ts
import { Injectable, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { User } from '@wegrowupupup/datatypes';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private api = inject(ApiClientService);
  users = httpResource<User[]>(() => this.api.base + '/users');
}
```

### Using in a Component

```ts
import { Component, inject } from '@angular/core';
import { UsersService } from '@wegrowupupup/data-access';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  protected usersService = inject(UsersService);
  protected users = this.usersService.users;
}
```

### Provide API Base in appConfig

```ts
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { API_BASE_URL } from '@wegrowupupup/data-access';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(appRoutes),
    { provide: API_BASE_URL, useValue: '/api' },
  ],
};
```

---

## Development Workflow

```bash
nx serve web
```

* Starts NestJS API and Angular app together
* `/api` requests are proxied automatically

---

## Summary

* Nx workspace with Angular + NestJS + Tailwind
* Scalable API client library using `httpResource`
* Domain-specific services inside `libs/data-access`
* InjectionToken for API base, easy to override
* Components stay clean and declarative
