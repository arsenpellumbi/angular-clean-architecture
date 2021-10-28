import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/core/guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeModule } from './home/home.module';
import { ProjectsModule } from './projects/projects.module';
import { ErrorModule } from './error/error.module';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => HomeModule,
      },
      {
        path: 'projects',
        loadChildren: () => ProjectsModule,
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () => AuthModule,
  },
  {
    path: 'error',
    loadChildren: () => ErrorModule,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
