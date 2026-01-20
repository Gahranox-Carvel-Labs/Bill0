/**
 * Author: Abdul Faheem A
 * Copyrights: Gahranox Carvel Labs Technologies
 * Purpose: Unit tests for the root App component.
 * Usecase: Ensures the application shell boots correctly and initializes state.
 */

import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { SeoService } from './core/seo.service';

describe('App', () => {
  let seoServiceSpy: jasmine.SpyObj<SeoService>;

  beforeEach(async () => {
    seoServiceSpy = jasmine.createSpyObj('SeoService', ['setSeoData']);

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: SeoService, useValue: seoServiceSpy }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize SEO data', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges(); // triggers ngOnInit
    expect(seoServiceSpy.setSeoData).toHaveBeenCalled();
  });
});
