#!/usr/bin/env node

const { createProxy } = require('../')

const echo = createProxy('echo')

echo
    .proxy('sample1', async (args) => {
        return 'sample1 transformed'
    })
    .proxy('sample2 <value>', async (args) => {
        return 'sample2 transformed'
    })
    .proxy('first second [optionalvalue]', async (args) => {
        return 'sample3 transformed'
    })
    .proxy('c1 c2', async (args) => {
        return 'c1 c2 command'
    })
    .proxy('with-opt', async (args) => {
        return 'with-opt'
    })
    .proxy('set', async (args) => {
        return `set --key ${args.key}`
    })
    .proxy('many-opts', async (args) => {
        return 'yes there are many opts'
    })
    .appendOptions()
    .proxy('opts-override', async (args) => {
        return 'opts override -f yes --name sure'
    })
    .appendOptions()
    .proxy('done', async (args, done) => {
        console.log('DONE')
        return done()
    })
    .run()
