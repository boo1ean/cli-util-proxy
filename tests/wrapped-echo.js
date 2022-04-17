#!/usr/bin/env node

const Wrapper = require('../')

const echo = new Wrapper.default('echo')

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
    .run()