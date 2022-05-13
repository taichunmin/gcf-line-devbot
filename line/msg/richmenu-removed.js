module.exports = command => ({
  type: 'flex',
  altText: '已移除選單，在手機中點選下方按鈕可再次啟用。',
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
          text: '已移除選單，在手機中點選下方按鈕可再次啟用。',
          type: 'text',
          wrap: true,
        },
        {
          color: '#08c356',
          style: 'primary',
          type: 'button',
          action: {
            label: '再次啟用選單',
            text: command,
            type: 'message',
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
          size: 'lg',
          text: '已移除選單',
          type: 'text',
        },
      ],
    },
  },
})
