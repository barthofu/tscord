module.exports = (plop) => {

    plop.setGenerator('event', {

        description: 'Create a new event file',
        
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'What is the name of the event file?',
        }],
        actions: [{
            type: 'add',
            path: '../src/events/{{camelCase name}}.ts',
            templateFile: 'templates/event.ts.hbs',
        }]
    })
}