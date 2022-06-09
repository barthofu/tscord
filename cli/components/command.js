module.exports = {
    description: 'Create a new command file',
    prompts: [{
        type: 'input',
        name: 'name',
        message: 'What is the name of the command file?',
    }],
    actions: [{
        type: 'add',
        path: 'src/commands/{{camelCase name}}.ts',
        templateFile: 'cli/templates/command.ts.hbs',
    }]
}