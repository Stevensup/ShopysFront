// Importing the Component decorator from the Angular core module
import { Component } from '@angular/core';

// Using the @Component decorator to define metadata for the component
@Component({
  // Selector for the component, used in HTML to include the component
  selector: 'app-footer',

  // Path to the HTML template file for this component
  templateUrl: './footer.component.html',

  // Array of stylesheets to be applied to the HTML template
  styleUrls: ['./footer.component.css']
})
// Class definition for the FooterComponent
export class FooterComponent {
  // The class may contain properties, methods, and other logic related to the component
}
