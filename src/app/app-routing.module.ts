import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Graph2dComponent } from './modules/graph2d/graph2d.component';
import { Graph3dComponent } from './modules/graph3d/graph3d.component';
import { HomeComponent } from './modules/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, children: [
    { path: '2d', component: Graph2dComponent },
    { path: '3d', component: Graph3dComponent }
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
