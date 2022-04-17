import { spawn } from 'child_process'
import createDebugLog from 'debug'
import minimist from 'minimist'
const debug = createDebugLog('cli-util-proxy')

type CommandTransformFunction = (args: any) => Promise<string>;
type ProxyCommandConfig = {
    path: string;
    transform: CommandTransformFunction;
    shouldAppendOptions?: boolean;
}

export default class Wrapper {
    #command: string
    #proxies: ProxyCommandConfig[] = []

    constructor (command: string) {
        this.#command = command;
    }

    proxy (path: string, transform: CommandTransformFunction) {
        debug(`Add proxy: "${path}"`)
        this.#proxies.push({ path, transform })
        return this
    }

    run () {
        return this.runWithArgs(process.argv.slice(2))
    }

    async runWithArgs (argv: string[]) {
        try {
            const transformedCommand = await this.getTransformedCommand(argv)
            debug(`Transformed command: ${transformedCommand}`)
            return this.runnDefaultCommand(transformedCommand.split(' '))
        } catch (error) {
            debug(`Got exception: ${error.message}`)
            return this.runnDefaultCommand(argv)
        }
    }

    async getTransformedCommand (argv: string[]) {
        const args = minimist(argv)
        for (const { path, transform, shouldAppendOptions } of this.#proxies) {
            const params = isMatchingCommand(path, args._)
            if (params) {
                let transformedCommand = await transform({
                    ...args,
                    params,
                })

                if (shouldAppendOptions) {
                    transformedCommand += ' ' + serializeOptions(args, transformedCommand).join(' ')
                }

                return transformedCommand
            }
        }
        throw new Error()
    }

    runnDefaultCommand (args: string[]) {
        debug(`Run: ${this.#command} ${args.join(' ')}`)
        spawn(this.#command, args, {
            stdio: 'inherit'
        });
    }

    appendOptions () {
        this.#proxies[this.#proxies.length - 1].shouldAppendOptions = true
        return this
    }
}

function isMatchingCommand (command: string, args: string[]): any {
    const commandTokens = command.split(' ')
    const mapping: any = {}
    for (const i in commandTokens) {
        const token = commandTokens[i]
        // Required argument
        if (/^\<.+\>$/.test(token)) {
            if (args[i]) {
                mapping[token.slice(1, -1)] = args[i]
            } else {
                return false
            }
        // Optional argument
        } else if (/^\[.+\]$/.test(token)) {
            mapping[token.slice(1, -1)] = args[i]
        // Exact match
        } else if (token !== args[i]) {
            return false
        }
    }
    return mapping
}

function serializeOptions (args: any, command: string) {
    const options = { ...args }
    delete options._
    const result = []
    for (const key in options) {
        const opt = getOptPrefix(key)
        if (command.includes(` ${opt} `) || command.endsWith(` ${opt}`)) {
            continue
        }
        result.push(opt)
        if (options[key] !== true) {
            result.push(options[key])
        }
    }
    return result
}

function getOptPrefix (key: string) {
    return (key.length === 1 ? '-' : '--') + key
}