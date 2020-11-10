module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '14.15'
        }
      }
    ],
    '@babel/preset-react',
    'vue'
  ]
}
