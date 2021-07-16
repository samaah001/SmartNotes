import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    children:[
      {
        path:'',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      }, 
      {
        path: 'details',
        loadChildren: () => import('./details/details.module').then( m => m.DetailsPageModule)
      },
      {
        path: 'viewer/:path',
        loadChildren: () => import('./viewer/viewer.module').then( m => m.ViewerPageModule)
      },
      {
        path: 'viewhigh/:high',
        loadChildren: () => import('./viewhigh/viewhigh.module').then( m => m.ViewhighPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }) 
    ],
  
  exports: [RouterModule]
})
export class AppRoutingModule { }
