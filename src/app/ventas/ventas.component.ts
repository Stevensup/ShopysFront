import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CarritoService } from '../carrito.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
})
export class VentasComponent implements OnInit {
  productos: any[] = [];

  // Agregamos la propiedad dataSource con tipo MatTableDataSource<any>
  dataSource = new MatTableDataSource<any>([]);

  // Agregamos la propiedad columnas
  columnas: string[] = [ 'nombre', 'precio', 'descripcion', 'cantidad','categoria', 'agregarAlCarrito'];

  // Referencia al paginador
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort; // Agregado MatSort

  constructor(private http: HttpClient, private carritoService: CarritoService) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:8080/producto/productos').subscribe(
      (data) => {
        this.productos = data;
        this.dataSource.data = data; // Asignamos datos a la fuente de datos
        this.dataSource.paginator = this.paginator; // Asignamos el paginador
      },
      (error) => {
        console.error('Error al cargar productos', error);
      }
    );
  }

  editarCantidad(producto: any): void {
    producto.editandoCantidad = true;
    producto.nuevaCantidad = producto.cantidadInventario;
  }

  actualizarCantidad(producto: any): void {
    // Lógica para enviar la nueva cantidad a la base de datos
    // ... (tu código para actualizar la cantidad en la base de datos)

    // Después de actualizar, puedes hacer algo como esto
    producto.cantidadInventario = producto.nuevaCantidad;
    producto.editandoCantidad = false;
  }

  cancelarEdicion(producto: any): void {
    producto.editandoCantidad = false;
  }

  agregarAlCarrito(producto: any): void {
    console.log('Agregando al carrito:', producto);
    this.carritoService.agregarProducto(producto);
  }



  aplicarFiltro(event: Event): void {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

}
