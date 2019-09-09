const { override, fixBabelImports } = require('customize-cra');
module.exports = override(
    fixBabelImports('import', {
      libraryName: 'material-ui/core',
      libraryDirectory: 'es',
      style: 'css'
    }))
