import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./modules/dashboard/pages/dashboard.page').then((m) => m.DashboardPageComponent),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./modules/users/pages/users.page').then((m) => m.UsersPageComponent),
  },
  {
    path: 'companies',
    loadComponent: () =>
      import('./modules/companies/pages/companies.page').then((m) => m.CompaniesPageComponent),
  },
  {
    path: 'branches',
    loadComponent: () =>
      import('./modules/branches/pages/branches.page').then((m) => m.BranchesPageComponent),
  },
  {
    path: 'conversations',
    loadComponent: () =>
      import('./modules/conversations/pages/conversations.page').then((m) => m.ConversationsPageComponent),
  },
  {
    path: 'messages',
    loadComponent: () =>
      import('./modules/messages/pages/messages.page').then((m) => m.MessagesPageComponent),
  },
  {
    path: 'channels',
    loadComponent: () =>
      import('./modules/channel-connections/pages/channel-connections.page').then((m) => m.ChannelConnectionsPageComponent),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

