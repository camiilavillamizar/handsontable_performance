import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  exports: [
    MatButtonModule,
    MatExpansionModule, 
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class MaterialModule { }
