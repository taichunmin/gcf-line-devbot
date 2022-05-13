module.exports = alias => ({
  type: 'flex',
  altText: '已切換選單，請於手機上開啟。',
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
          text: `已成功幫您切換至「${alias}」選單，請在手機上點選下方按鈕開啟選單。`,
          type: 'text',
          wrap: true,
        },
        {
          color: '#08c356',
          style: 'primary',
          type: 'button',
          action: {
            data: 'openRichMenu',
            inputOption: 'openRichMenu',
            label: '開啟選單（限手機）',
            type: 'postback',
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
          text: '已切換選單',
          type: 'text',
        },
      ],
    },
  },
})
