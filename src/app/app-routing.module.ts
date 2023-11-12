// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaProductosComponent } from './consulta-productos/consulta-productos.component';
import { VentasComponent } from './ventas/ventas.component';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/productos', pathMatch: 'full' },
  { path: 'productos', component: ConsultaProductosComponent },
  { path: 'ventas', component: VentasComponent },
  { path: 'facturacion', component: FacturacionComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
