module.exports = (plop) => {

    plop.setGenerator('event', {

        description: 'Create a new event file',
        
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the event file?',
            },
            {
                type: 'confirm',
                name: 'customEvent',
                message: 'Is your event a custom event?',
            }
        ],
        actions: [{
            type: 'add',
            path: '../src/events/{{#if customEvent}}custom/{{/if}}{{camelCase name}}.ts',
            templateFile: 'templates/event.ts.hbs',
        }]
    })
}