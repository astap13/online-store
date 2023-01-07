window.addEventListener('load', () => {
    if (window.location.href.includes('product-details')) {
        const script = document.createElement('script');
        script.src = '/index.js';
        document.head.append(script);
    }
});
