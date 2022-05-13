module.exports = ({ title, body, text }) => ({
  type: 'flex',
  altText: title,
  contents: {
    type: 'bubble',
    body: {
      borderColor: '#08c356',
      borderWidth: '10px',
      layout: 'vertical',
      paddingAll: '10px',
      spacing: 'md',
      type: 'box',
      contents: [
        {
          align: 'center',
          size: 'sm',
          text: body,
          type: 'text',
          wrap: true,
        },
        {
          color: '#08c356',
          style: 'primary',
          type: 'button',
          action: {
            label: '點選後送出文字 (限手機)',
            type: 'uri',
            uri: `https://line.me/R/oaMessage/@736cebrk/?${encodeURIComponent(text)}`,
          },
        },
      ],
    },
    header: {
      backgroundColor: '#2a2a2a',
      layout: 'vertical',
      type: 'box',
      contents: [
        {
          align: 'center',
          color: '#ffffff',
          text: title,
          type: 'text',
        },
      ],
    },
  },
})
