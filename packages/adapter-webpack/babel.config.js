module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '14.16'
        }
      }
    ],
    '@babel/preset-react',
    'vue'
  ]
}
