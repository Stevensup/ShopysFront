import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConsultaProductosComponent } from './consulta-productos/consulta-productos.component';
import { VentasComponent } from './ventas/ventas.component';
import { ResumenCompraComponent } from './resumen-compra/resumen-compra.component';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CarritoModalComponent } from './carrito-modal/carrito-modal.component';
import { CreateUserModalComponent } from './create-user-modal/create-user-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';  


@NgModule({
  declarations: [
    AppComponent,
    ConsultaProductosComponent,
    VentasComponent,
    ResumenCompraComponent,
    FacturacionComponent,
    LoginModalComponent,
    NavbarComponent,
    FooterComponent,
    CarritoModalComponent,
    CreateUserModalComponent  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
  ],
  providers: [],
  bootstrap: [VentasComponent] // Corregido para bootstrappear AppComponent
})
export class AppModule { }
