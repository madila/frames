import oculus from './modules/oculus';
import imageFade from './modules/imageFade';
import scrollTracker from "./modules/scrollTracker";

function RGBAToHSL(r,g,b,a) {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    // Calculate hue
    // No difference
    if (delta == 0)
        h = 0;
    // Red is max
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
        h = (b - r) / delta + 2;
    // Blue is max
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return "hsla(" + h + "," + s + "%," +l + "%," + a + ")";
}

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

    colourise = (scrolled = null) => {
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
        let { bodyScrolled, colourise, setThemeVariation, style } = this;

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

});
