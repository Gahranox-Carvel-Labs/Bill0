import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  setSeoData(title: string, description: string, keywords: string, type: string = 'website', image: string = 'assets/icons/icon-512x512.png', additionalSchemas: any[] = []) {
    this.titleService.setTitle(title);

    // Standard Meta Tags
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ name: 'keywords', content: keywords });
    this.metaService.updateTag({ name: 'author', content: 'Bill0' });

    // Open Graph (Facebook, LinkedIn)
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:type', content: type });
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ property: 'og:url', content: this.document.location.href });

    // Twitter Card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: image });

    // AEO/AIEO Optimization (Structured Data)
    this.setJsonLd(this.getOrganizationSchema());
    if (type === 'website' || type === 'SoftwareApplication') {
      this.setJsonLd(this.getWebSiteSchema(title, description));
    }

    if (type === 'SoftwareApplication') {
      this.setJsonLd(this.getSoftwareApplicationSchema(title, description));
    }

    additionalSchemas.forEach(schema => {
      this.setJsonLd(schema);
    });
  }

  private setJsonLd(data: any) {
    if (isPlatformBrowser(this.platformId)) {
      const scriptId = 'json-ld-data-' + (data['@type'] || 'default');
      let script = this.document.getElementById(scriptId) as HTMLScriptElement;

      if (!script) {
        script = this.document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        this.document.head.appendChild(script);
      }

      script.textContent = JSON.stringify(data);
    }
  }

  private getOrganizationSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Bill0",
      "url": "https://bill0.app",
      "logo": "https://bill0.app/Bill0logoCropped.png",
      "description": "Free, fast, and secure invoice generator for freelancers and small businesses.",
      "sameAs": [
        "https://www.facebook.com/bill0app",
        "https://twitter.com/bill0app",
        "https://www.linkedin.com/company/bill0app"
      ]
    };
  }

  private getWebSiteSchema(title: string, description: string) {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": title,
      "description": description,
      "url": "https://bill0.app",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://bill0.app/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };
  }

  private getSoftwareApplicationSchema(title: string, description: string) {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Bill0 Invoice Generator",
      "operatingSystem": "Web",
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": description,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "120"
      }
    };
  }

  getHowToSchema(steps: { name: string; text: string; image?: string }[]) {
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to generate a professional invoice with Bill0",
      "step": steps.map((s, i) => ({
        "@type": "HowToStep",
        "position": i + 1,
        "name": s.name,
        "itemListElement": [{
          "@type": "HowToDirection",
          "text": s.text
        }]
      }))
    };
  }

  getFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    };
  }
}
