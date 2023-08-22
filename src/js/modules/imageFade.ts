const callback = (entries: any[], observer: { unobserve: (arg0: any) => void; }) => {
    let order = 0;
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            entry.target.style.willChange = "opacity";
            entry.target.style.transitionDelay = (order * 10)+"ms";
            entry.target.classList.add("lazy-loaded");
            observer.unobserve(entry.target);
            order++;
        }
    })
}

const imageFade = (selector = ".wp-block-image img, .wp-post-image", options = {}) => {
    const templates = document.querySelectorAll(selector);
    if(templates.length > 0) {
        const myObserver = new IntersectionObserver(callback, options);
        templates.forEach((entries) => {
            myObserver.observe(entries);
        });
    }
}

export default imageFade;
