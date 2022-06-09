module.exports = (plop) => {

    plop.setGenerator('guard', {
    
        description: 'Create a new guard function',

        prompts: [{
            type: 'input',
            name: 'name',
            message: 'What is the name of the guard?',
        }],
        actions: [
            {
                type: 'add',
                path: '../src/guards/{{camelCase name}}.ts',
                templateFile: 'templates/guard.ts.hbs',
            },
            {
                type: 'append',
                path: '../src/guards/index.ts',
                template: 'export * from \'./{{camelCase name}}\'',
            }
        ]
    })
}