import { Component, signal } from '@angular/core';
import { InvoiceGeneratorComponent } from './features/invoice-generator/invoice-generator.component';

@Component({
  selector: 'app-root',
  imports: [InvoiceGeneratorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('raseed');
}
