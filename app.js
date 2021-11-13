/**@
 *
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
function between(val, min, max) {
    return Math.max(min, Math.min(val, max))
}

/**@
 *Gère le scaling a appliquer en fonction de la distance
 * @param {number} d
 */
function scaling(d) {
    return Math.max(Math.min(-0.2 * Math.pow(d, 2) + 1.05, 1), 0);
}

const TransformOrigins = {
    '-1': "right",
    '0': "center",
    '1': "left",
}

/**
 * @property {HTMLElement} root
 * @property {HTMLElement[]} icons
 * @property {number} iconSize
 * @property {number} mousePosition
 *
 */
class Dock {

    scale = 1;

    /**
     *
     * @param {HTMLElement} el
     */
    constructor(el) {
        this.root = el;
        this.icons = Array.from(el.children);
        if (this.icons.length === 0) {
            return;
        }
        this.iconSize = this.icons[0].offsetWidth;
        el.addEventListener('mousemove', this.handleMouseMove.bind(this))
        el.addEventListener('mouseleave', this.handleMouseLeave.bind(this))
        el.addEventListener('mouseenter', this.handleMouseEnter.bind(this))
    }

    /**
     *
     * @param {MouseEvent} e
     */

    handleMouseMove(e) {
        this.mousePosition = between(
            (e.clientX - this.root.offsetLeft) / this.iconSize,
            0,
            this.icons.length);
        console.log(this.icons.length)
        this.scaleIcons();

    };

    /**
     *Applique les transformation sur les icons
     */
    scaleIcons() {
        const selectedIndex = Math.floor(this.mousePosition);
        const centerOffset = this.mousePosition - selectedIndex - 0.5;
        console.log({centerOffset})

        let baseOffset = this.scaleFromDirection(selectedIndex, 0, -centerOffset * this.iconSize);
        let offset = baseOffset * (0.5 - centerOffset)
        for (let i = selectedIndex + 1; i < this.icons.length; i++) {
            offset += this.scaleFromDirection(i, 1, offset)
        }

        offset = baseOffset * (0.5 + centerOffset)
        for (let i = selectedIndex - 1; i >= 0; i--) {
            offset += this.scaleFromDirection(i, -1, -offset)
        }

    }

    /**
     *@param {number} index Index de l'icone à agrandire
     *@param {number} direction Position de l'icône (0: centre, -1 gauche, 1: droite)
     *@param {number} offset
     */
    scaleFromDirection(index, direction, offset) {

        const center = index + 0.5;
        const distanceFromPointer = this.mousePosition - center
        const scale = scaling(distanceFromPointer) * this.scale;
        const icon = this.icons[index];
        if (icon) {
            icon.style.setProperty(
                "transform",
                `translateX(${offset}px) scale(${scale + 1})`
            );

            icon.style.setProperty(
                "transform-origin",
                `${TransformOrigins[direction.toString()]} bottom`);
            return scale * this.iconSize;
        }

    }

    handleMouseLeave() {
        this.root.classList.add("animated");
        this.icons.forEach((icon) => {
            icon.style.removeProperty("transform")
            icon.style.removeProperty("transform-origin")
        })
    }

    handleMouseEnter() {
        this.root.classList.add("animated");
        window.setTimeout(() => {
            this.root.classList.remove("animated");
        }, 100)
    }

}

new Dock(document.querySelector(".dock"))

//31 min