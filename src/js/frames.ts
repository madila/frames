import oculus from './modules/oculus';
import scrollTracker from "./modules/scrollTracker";

class appBootstrap {
    lastScrollTop = 0;
    delta = 0;
    header:HTMLElement = null;

    bodyScrolled = () => {
        let { delta, lastScrollTop } = this,
            { document, scrollY, pageYOffset } = window,
            { documentElement } = document;

        let scrolled =
            (scrollY || documentElement.scrollTop) -
            (documentElement.clientTop || 0);

        if (scrolled > 1) {
            documentElement.classList.add('scrolled');
        } else {
            documentElement.classList.remove('scrolled');
        }

        this.lastScrollTop = scrollY;
    };

    colourise = () => {
        let { delta, lastScrollTop, header } = this,
            { document, scrollY, pageYOffset } = window,
            { documentElement } = document;

        const max = 150;

        if(scrollY > max) return;

        let scrolled =
            (pageYOffset || documentElement.scrollTop) -
            (documentElement.clientTop || 0);

        const opacity = scrollY / max;
        if(header) header.style.backgroundColor = `rgba(0,0,0,${opacity.toFixed(2)})`;
    }

	constructor(header:HTMLElement) {
        let { bodyScrolled, colourise } = this;

	    oculus();

        this.header = header;

		window.addEventListener('load', function () {
			//console.timeEnd('Frames has loaded...');
            document.documentElement.classList.add('wp-ready');
            window.addEventListener('scrollend', bodyScrolled);
            window.addEventListener('scroll', colourise);

		});

        scrollTracker('y', bodyScrolled);

	}
}

document.addEventListener('DOMContentLoaded', function () {
	//console.time('Frames has loaded...');

    const fixedHeader = document.querySelector('.is-fixed');

    const app = new appBootstrap(fixedHeader as HTMLElement);
    app.bodyScrolled();

});
