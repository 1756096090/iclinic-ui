import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/pages/login.page').then((m) => m.LoginPageComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/dashboard/pages/dashboard.page').then((m) => m.DashboardPageComponent),
  },
  {
    path: 'users',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/users/pages/users.page').then((m) => m.UsersPageComponent),
  },
  {
    path: 'companies',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/companies/pages/companies.page').then((m) => m.CompaniesPageComponent),
  },
  {
    path: 'branches',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/branches/pages/branches.page').then((m) => m.BranchesPageComponent),
  },
  {
    path: 'conversations',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/conversations/pages/conversations.page').then((m) => m.ConversationsPageComponent),
  },
  {
    path: 'messages',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/messages/pages/messages.page').then((m) => m.MessagesPageComponent),
  },
  {
    path: 'channels',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/channel-connections/pages/channel-connections.page').then((m) => m.ChannelConnectionsPageComponent),
  },
  {
    path: 'schedule',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/schedule/pages/schedule.page').then((m) => m.SchedulePageComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

