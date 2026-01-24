import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit {

  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.setSeoData(
      'Bill0 Pro - The Only Financial OS You Need',
      'From Local POS to Global Trade. Bill0 Pro features E-Invoicing, Contracts, AI Assistant, and Global Tax Compliance.',
      'billing software, invoice generator, e-invoicing, pos system, inventory management, bill0',
      'SoftwareApplication',
      'Bill0logoCropped.png'
    );
  }
}
