// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ConsultaProductosComponent } from './consulta-productos/consulta-productos.component';
import { VentasComponent } from './ventas/ventas.component';
import { FacturacionComponent } from './facturacion/facturacion.component';

const routes: Routes = [
  { path: '', redirectTo: '/productos', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'productos', component: ConsultaProductosComponent },
  { path: 'ventas', component: VentasComponent },
  { path: 'facturacion', component: FacturacionComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
