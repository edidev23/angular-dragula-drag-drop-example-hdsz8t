import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';
import { BoardComponent } from "./board.component";
import { OrderByPosition } from "./orderByPosition.pipe";

@NgModule({

    imports: [
        BrowserModule,
        FormsModule,
        CommonModule,
        DragulaModule.forRoot(),
    ],
    declarations: [
        BoardComponent,
        OrderByPosition
    ],
    exports: [
        BoardComponent
    ]

})
export class BoardModule {}
