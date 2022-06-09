const { commandComponent } = require('./cli/components')

module.exports = function (plop) {

    plop.setGenerator('command', commandComponent)
}