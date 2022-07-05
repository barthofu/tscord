const fs = require('fs')

module.exports = (plop) => {

    const categories = fs.readdirSync('./src/commands/').filter(category => !category.includes('.'))

    plop.setGenerator('command', {
    
        description: 'Create a new command file',

        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the command file?',
            },
            {
                type: 'list',
                name: 'category',
                message: 'Category of your command',
                choices: categories
            }
        ],
        actions: [{
            type: 'add',
            path: '../src/commands/{{pascalCase category}}/{{camelCase name}}.ts',
            templateFile: 'templates/command.ts.hbs',
        }]
    })
}