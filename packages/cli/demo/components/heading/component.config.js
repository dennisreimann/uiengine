module.exports = {
  title: 'Heading',
  label: 'A1',
  variants: [
    {
      title: 'Title',
      label: 'A1-1',
      file: 'title.html',
      context: {
        heading: {
          text: 'The title heading',
          type: 'title'
        }
      }
    },
    {
      title: 'Subtitle',
      label: 'A1-2',
      file: 'subtitle.html',
      context: {
        heading: {
          text: 'This is a subtitle heading',
          type: 'subtitle'
        }
      }
    }
  ]
}
