module.exports = (plop) => {

    plop.setGenerator('command', {
    
        description: 'Create a new command file',

        prompts: [{
            type: 'input',
            name: 'name',
            message: 'What is the name of the command file?',
        }],
        actions: [{
            type: 'add',
            path: '../src/commands/{{camelCase name}}.ts',
            templateFile: 'templates/command.ts.hbs',
        }]
    })
}