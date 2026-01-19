(function() {
    function setMeta(name, content, attribute = 'name') {
        let element = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(attribute, name);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    }

    // Standard SEO
    document.title = "Raseed - Free Online Invoice Generator";
    setMeta('description', 'Raseed is a free, fast, and secure online invoice generator. Create professional PDF invoices with QR codes instantly. No account needed.');
    setMeta('keywords', 'invoice generator, free invoice, pdf invoice, raseed, online billing, receipt maker, qr code invoice');
    setMeta('robots', 'index, follow');
    setMeta('author', 'Raseed');

    // Open Graph / Facebook
    setMeta('og:title', 'Raseed - Free Online Invoice Generator', 'property');
    setMeta('og:description', 'Create professional PDF invoices with QR codes instantly. No account needed.', 'property');
    setMeta('og:image', window.location.origin + '/raseedlogo.png', 'property');
    setMeta('og:url', window.location.href, 'property');
    setMeta('og:type', 'website', 'property');

    // Twitter
    setMeta('twitter:card', 'summary_large_image', 'name');
    setMeta('twitter:title', 'Raseed - Free Online Invoice Generator', 'name');
    setMeta('twitter:description', 'Create professional PDF invoices with QR codes instantly. No account needed.', 'name');
    setMeta('twitter:image', window.location.origin + '/raseedlogo.png', 'name');

    // JSON-LD (AEO)
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Raseed",
        "url": window.location.origin,
        "description": "A free online invoice generator application that allows users to create and download PDF invoices with QR codes.",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": "PDF Generation, QR Code Integration, Instant Preview, No Signup Required",
        "screenshot": window.location.origin + '/raseedlogoHeader.png',
        "author": {
            "@type": "Organization",
            "name": "Raseed"
        }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    // Canonical Link
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
    }
    link.href = window.location.href.split('?')[0];

})();
