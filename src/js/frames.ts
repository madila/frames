import oculus from './modules/oculus';
import imageFade from './modules/imageFade';
import scrollTracker from "./modules/scrollTracker";

class appBootstrap {
    lastScrollTop : number = 0;
    delta: number = 0;
    style: string = 'default';
    color: string[];
    header:HTMLElement = null;

    bodyScrolled = (scrolled = null) => {

        let { document, scrollY } = window,
            { documentElement } = document;

        if(!scrolled) {
            scrolled =
                (scrollY || documentElement.scrollTop) -
                (documentElement.clientTop || 0);
        }

        if (scrolled > 1) {
            documentElement.classList.add('scrolled');
        } else {
            documentElement.classList.remove('scrolled');
        }

        this.lastScrollTop = scrollY;
    };

    windowUnit = (event:Event) => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    colourise = (scrolled:number|null = null) => {
        let { header } = this,
            { document } = window,
            { documentElement } = document;

        const max = 400;

        if(scrolled > max) return;

        if(!scrolled) {
            scrolled =
                (scrollY || documentElement.scrollTop) -
                (documentElement.clientTop || 0);
        }

        if(scrolled < 10) {
            header.style.transition = 'background-color 200ms linear';
        }

        const opacity = scrolled / max;
        let headerColor = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${opacity.toFixed(2)} )`;
        if(header) header.style.setProperty("background-color", headerColor, "important");
    }

    setThemeVariation = () => {
        const themeStyle = getComputedStyle(document.body)
            .getPropertyValue('--wp--custom--theme--name');

        this.style = themeStyle || this.style;
    }

	constructor(header:HTMLElement) {
        let { bodyScrolled, colourise, setThemeVariation, windowUnit, style } = this;

        windowUnit(null);

        window.addEventListener('resize', windowUnit);

        window.addEventListener('load', function () {
            document.documentElement.classList.add('wp-load');
        });

        setThemeVariation();
        document.documentElement.classList.add(`frames-variation-${style}`);

	    oculus();

        imageFade();

        if(header) {
            this.header = header;

            const headerColor = getComputedStyle(header).getPropertyValue("background-color");

            // @ts-ignore
            const rgba = headerColor.includes('rgba') ? 5 : 4;
            this.color = headerColor.substring(rgba, headerColor.length-1)
                .replace(/ /g, '')
                .split(',');

            colourise();
        }

        window.requestAnimationFrame(() => {
            document.documentElement.classList.add('wp-ready');
            scrollTracker('y', bodyScrolled);
            if(header) scrollTracker('y', colourise);
        });

	}
}

document.addEventListener('DOMContentLoaded', function () {

    const stickyHeader = document.querySelector('header.has-background.is-position-sticky');

    const app = new appBootstrap(stickyHeader as HTMLElement);
    app.bodyScrolled(null);
    app.windowUnit();

});
