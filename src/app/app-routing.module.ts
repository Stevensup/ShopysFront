// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentasComponent } from './ventas/ventas.component';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { LoginModalComponent } from './login-modal/login-modal.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'ventas', component: VentasComponent },
  { path: 'facturacion', component: FacturacionComponent },
  { path: 'login-modal', component: LoginModalComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
