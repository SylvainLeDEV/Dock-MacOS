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

const tranformOrigins = {
    '-1': 'right',
    '0': 'center',
    '1': 'left'
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
        if (this.icons === 0) {
            return;
        }
        this.iconSize = this.icons[0].offsetWidth;
        el.addEventListener('mousemove', this.handleMouseMove.bind(this))
    }

    /**
     *
     * @param {MouseEvent} e
     */

    handleMouseMove(e) {
        this.mousePosition = between((e.clientX - this.root.offsetLeft) / this.iconSize, 0, this.icons.length);
        this.scaleIcons();
        // console.log(this.mousePosition)
    };

    /**
     *Applique les transformation sur les icons
     */
    scaleIcons() {
        const selectedIndex = Math.floor(this.mousePosition);

        let baseOffset = this.scaleFromDirection(selectedIndex, 0, 0) / 2;
        let offset = baseOffset / 2
        for (let i = selectedIndex + 1; i <= this.icons.length; i++) {
            offset += this.scaleFromDirection(i, 1, offset)
        }
        ;
        offset = baseOffset / 2
        for (let i = selectedIndex + 1; i >= 0; i--) {
            offset += this.scaleFromDirection(i, 1, -offset)
        }
        ;
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
        const icon = this.icons[index]
        icon.style.setProperty(
            'transform',
            `translateX(${offset}px) scale(${scale+1})`
        );

        icon.style.setProperty(
            'transform-origin',
            `${tranformOrigins[direction.toString()]} bottom`);
        return scale * this.iconSize


    }
}

new Dock(document.querySelector(".dock"))

//31 min