/**
 * Plopfile generator
 *
 * https://github.com/amwmedia/plop
 */

module.exports = function (plop) {

    plop.load('./generators/command.js')
    plop.load('./generators/event.js')
    plop.load('./generators/entity.js')
    plop.load('./generators/guard.js')
}