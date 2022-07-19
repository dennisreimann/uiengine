module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '16.16'
        }
      }
    ],
    '@babel/preset-react',
    'vue'
  ]
}
