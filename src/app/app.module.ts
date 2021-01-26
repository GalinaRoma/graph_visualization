import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphComponent } from './modules/graph/graph.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InfoDialogComponent } from './modules/info-dialog/info-dialog.component';
import { DemoMaterialModule } from './material.module';
import {AddNodeDialogComponent} from './modules/add-node-dialog/add-node-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    InfoDialogComponent,
    AddNodeDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DemoMaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
