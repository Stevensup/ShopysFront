import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConsultaProductosComponent } from './consulta-productos/consulta-productos.component';
import { VentasComponent } from './ventas/ventas.component';
import { ResumenCompraComponent } from './resumen-compra/resumen-compra.component';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    ConsultaProductosComponent,
    VentasComponent,
    ResumenCompraComponent,
    FacturacionComponent,
    LoginComponent,
    NavbarComponent,
    FooterComponent,
    LoginModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [VentasComponent] // Corregido para bootstrappear AppComponent
})
export class AppModule { }
