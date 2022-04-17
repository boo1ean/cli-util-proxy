# cli-util-proxy

Create proxy for any CLI util, decorate/transform its behavior.

## Installation

```
npm i cli-util-proxy
```

## Example

Add shortcuts to `kubectl`

```javascript
#!/usr/bin/env node
const { createProxy } = require('cli-util-proxy') 

createProxy('kubectl')
	.proxy('g p', () => 'get pods')
	.proxy('c c', () => 'config current-context')
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
