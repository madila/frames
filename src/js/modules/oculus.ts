const callback = (entries: any[], observer: { unobserve: (arg0: any) => void; }) => {
    let order = 0;
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            entry.target.style.willChange = "opacity";
            entry.target.style.transitionDelay = (order * 5)+"ms";
            entry.target.classList.add("wp-block-shown-on-screen");
            observer.unobserve(entry.target);
            order++;
        }
    })
}

const oculus = (selector = ".wp-block-template-part, .wp-block-cover__inner-container > *, .wp-block-column > *, .wp-block-group > *", options = {}) => {
    const templates = document.querySelectorAll(selector);
    if(templates.length > 0) {
        const myObserver = new IntersectionObserver(callback, options);
        templates.forEach((entries) => {
            myObserver.observe(entries);
        });
    }
}

export default oculus;
