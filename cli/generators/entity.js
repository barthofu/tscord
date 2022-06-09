module.exports = (plop) => {

    plop.setGenerator('entity', {

        description: 'Create a new entity',
        
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'What is the name of the entity?',
        }],
        actions: [
            {
                type: 'add',
                path: '../src/entities/{{pascalCase name}}.ts',
                templateFile: 'templates/entity.ts.hbs',
            },
            {
                type: 'append',
                path: '../src/entities/index.ts',
                template: 'export * from \'./{{pascalCase name}}\'',
            }
        ]
    })
}