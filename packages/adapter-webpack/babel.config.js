module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '12.16'
        }
      }
    ],
    '@babel/preset-react',
    'vue'
  ]
}
