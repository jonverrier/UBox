module.exports = {
   devtool: 'source-map',
   entry: "./src/AppUI.tsx",
   mode: "development",
   target: 'node',
   output: {
      filename: "../../apisrv/public/client-bundle.js",
      devtoolModuleFilenameTemplate: '[resource-path]',  // removes the webpack:/// prefix
      libraryTarget: 'commonjs'
   },
   resolve: {
      extensions: ['.tsx', '.ts', '.js']
   },
   module: {
      rules: [
         {
            test: /\.tsx$/,
            exclude: /(node_modules|bower_components)/,
            use: {
               loader: 'ts-loader',
               options: {
                  configFile: "tsconfig.json"
               }
            }
         },
         {
            test: /\.ts$/,
            exclude: /(node_modules|bower_components)/,
            use: {
               loader: 'ts-loader',
               options: {
                  configFile: "tsconfig.json"
               }
            }
         }
      ]
   }
}