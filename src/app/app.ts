/**
 * Author: Abdul Faheem A
 * Copyrights: Gahranox Carvel Labs Technologies
 * Purpose: Root component of the Bill0 application, coordinating top-level navigation and application-wide state.
 * Usecase: Acts as the entry point for the Angular application, hosting the primary router outlet for feature views.
 */

import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeoService } from './core/seo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Bill0');

  constructor(private seoService: SeoService) { }

  ngOnInit() {
    this.seoService.setSeoData(
      'Bill0 - Free Invoice Generator',
      'Create professional invoices for free with Bill0. Fast, secure, and no login required. Perfect for freelancers and small businesses.',
      'invoice generator, free invoice, freelance invoice, bill0, invoice template, online invoice'
    );
  }
}
