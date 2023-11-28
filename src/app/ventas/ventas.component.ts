import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CarritoService } from '../carrito.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

/**
 * Componente de ventas.
 */
@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
})
export class VentasComponent implements OnInit {
  /**
   * Lista de productos.
   */
  productos: any[] = [];

  /**
   * Fuente de datos para la tabla.
   */
  dataSource = new MatTableDataSource<any>([]);

  /**
   * Columnas de la tabla.
   */
  columnas: string[] = [
    'nombre',
    'precio',
    'descripcion',
    'cantidad',
    'categoria',
    'agregarAlCarrito',
  ];

  /**
   * Referencia al paginador.
   */
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private carritoService: CarritoService
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit() {
    this.http.get<any[]>('http://localhost:8090/producto/productos').subscribe(
      (data) => {
        this.productos = data;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('Error al cargar productos', error);
      }
    );
  }

  /**
   * Método para editar la cantidad de un producto.
   * @param producto El producto a editar.
   */
  editarCantidad(producto: any): void {
    producto.editandoCantidad = true;
    producto.nuevaCantidad = producto.cantidadInventario;
  }

  /**
   * Método para actualizar la cantidad de un producto.
   * @param producto El producto a actualizar.
   */
  actualizarCantidad(producto: any): void {
    // Lógica para enviar la nueva cantidad a la base de datos
    // ... (tu código para actualizar la cantidad en la base de datos)

    // Después de actualizar, puedes hacer algo como esto
    producto.cantidadInventario = producto.nuevaCantidad;
    producto.editandoCantidad = false;
  }

  /**
   * Método para cancelar la edición de la cantidad de un producto.
   * @param producto El producto a cancelar la edición.
   */
  cancelarEdicion(producto: any): void {
    producto.editandoCantidad = false;
  }

  /**
   * Método para agregar un producto al carrito.
   * @param producto El producto a agregar al carrito.
   */
  agregarAlCarrito(producto: any): void {
    this.carritoService.agregarProducto(producto);
  }

  /**
   * Método para aplicar un filtro a la tabla.
   * @param event El evento que desencadena el filtro.
   */
  aplicarFiltro(event: Event): void {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }
}
