import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CarritoService } from '../carrito.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

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
  columnas: string[] = ['id', 'nombre', 'precio', 'descripcion', 'agregarAlCarrito', 'cantidad', 'total'];

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
  agregarAlCarrito(producto: any): void {
    console.log('Agregando al carrito:', producto);
    this.carritoService.agregarProducto(producto);
  }

  aplicarFiltro(event: Event): void {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

}
