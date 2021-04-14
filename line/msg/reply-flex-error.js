const _ = require('lodash')

module.exports = data => ({
  altText: data.message || '訊息物件有誤',
  type: 'flex',
  contents: {
    size: 'giga',
    type: 'bubble',
    body: {
      layout: 'vertical',
      spacing: 'md',
      type: 'box',
      contents: _.map(data.details, detail => ({
        layout: 'horizontal',
        spacing: 'md',
        type: 'box',
        contents: [
          {
            height: '40px',
            layout: 'vertical',
            type: 'box',
            width: '40px',
            contents: [
              {
                aspectMode: 'cover',
                aspectRatio: '1:1',
                size: 'full',
                type: 'image',
                url: 'https://i.imgur.com/2VH5JeS.png',
              },
            ],
          },
          {
            layout: 'vertical',
            spacing: 'xs',
            type: 'box',
            contents: [
              {
                color: '#666666',
                flex: 0,
                size: 'xxs',
                text: detail.property,
                type: 'text',
                wrap: true,
              },
              {
                flex: 1,
                layout: 'vertical',
                type: 'box',
                contents: [
                  {
                    type: 'filler',
                  },
                ],
              },
              {
                flex: 0,
                size: 'sm',
                text: detail.message,
                type: 'text',
                wrap: true,
              },
            ],
          },
        ],
      })),
    },
    header: {
      backgroundColor: '#00C300',
      layout: 'vertical',
      spacing: 'sm',
      type: 'box',
      contents: [
        {
          color: '#99ff99',
          size: 'xxs',
          text: '訊息物件有誤',
          type: 'text',
          weight: 'bold',
        },
        {
          color: '#ffffff',
          text: data.message || '訊息物件有誤',
          type: 'text',
          wrap: true,
        },
      ],
    },
  },
})
