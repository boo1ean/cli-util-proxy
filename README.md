# cli-util-proxy

Create proxy for any CLI util, decorate/transform its behavior.

## Installation

```
npm i cli-util-proxy
```

## Example

Add shortcuts to `kubectl`

NOTE: `args` - is `process.argv` parsed by [minimist](https://github.com/substack/minimist) + `params` property which contains positional params

```javascript
#!/usr/bin/env node
const { createProxy } = require('cli-util-proxy') 

createProxy('kubectl')
	.proxy('g p', () => 'get pods')
	.proxy('c c', () => 'config current-context')
	.proxy('l <query>', async args => {
		const podName = await findPodNameByQuery(args.params.query)
		return `logs ${podName}`
	})
	.run()
```

Make executable

```
chmod +x path/to/kubectl.js
```

Add alias

```
alias k="path/to/kubectl.js"
```

Use it

```
k g p
# same as
k get pods

k c c
# same as
k config current-context

# fallbacks to kubectl
k config view
```

## Interrupt command and don't proxy forward

This will replace `kubectl get pods`

```javascript
createProxy('kubectl')
	.proxy('get pods', (args, done) => {
		console.log('No pods for you!')
		done()
	})
```
