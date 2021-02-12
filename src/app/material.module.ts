import { NgModule} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  exports: [
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
  ]
})
export class DemoMaterialModule {}
//
//
// /**  Copyright 2020 Google LLC. All Rights Reserved.
//  Use of this source code is governed by an MIT-style license that
//  can be found in the LICENSE file at http://angular.io/license */
