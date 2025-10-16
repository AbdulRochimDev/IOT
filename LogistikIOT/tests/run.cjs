const { register } = require('ts-node')

register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    moduleResolution: 'node'
  }
})

require('./html5qrcode-loader.test.ts')
