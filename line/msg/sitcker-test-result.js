const _ = require('lodash')

module.exports = ({ nextCmd, stickers, title }) => ({
  altText: title,
  type: 'flex',
  contents: {
    type: 'bubble',
    body: {
      layout: 'vertical',
      spacing: 'xl',
      type: 'box',
      contents: [
        {
          color: '#1DB446',
          size: 'sm',
          text: title,
          type: 'text',
          weight: 'bold',
        },
        ..._.flatMap(stickers, sticker => [
          {
            backgroundColor: '#cccccc',
            height: '1px',
            layout: 'vertical',
            type: 'box',
            contents: [],
          },
          {
            layout: 'horizontal',
            spacing: 'md',
            type: 'box',
            contents: [
              {
                flex: 0,
                height: '64px',
                layout: 'vertical',
                type: 'box',
                width: '64px',
                contents: [
                  {
                    aspectMode: 'fit',
                    aspectRatio: '1:1',
                    size: 'full',
                    type: 'image',
                    url: `https://stickershop.line-scdn.net/stickershop/v1/sticker/${sticker.stickerId}/android/sticker.png;compress=true`,
                  },
                ],
              },
              {
                layout: 'vertical',
                spacing: 'sm',
                type: 'box',
                contents: [
                  {
                    flex: 1,
                    layout: 'vertical',
                    type: 'box',
                    contents: [],
                  },
                  {
                    flex: 0,
                    layout: 'horizontal',
                    type: 'box',
                    contents: [
                      {
                        color: '#555555',
                        flex: 0,
                        size: 'sm',
                        text: 'packageId',
                        type: 'text',
                      },
                      {
                        align: 'end',
                        color: '#111111',
                        size: 'sm',
                        text: `${sticker.packageId}`,
                        type: 'text',
                      },
                    ],
                  },
                  {
                    flex: 0,
                    layout: 'horizontal',
                    type: 'box',
                    contents: [
                      {
                        color: '#555555',
                        flex: 0,
                        size: 'sm',
                        text: 'stickerId',
                        type: 'text',
                      },
                      {
                        align: 'end',
                        color: '#111111',
                        size: 'sm',
                        text: `${sticker.stickerId}`,
                        type: 'text',
                      },
                    ],
                  },
                  {
                    color: sticker.message ? '#dc3545' : '#28a745',
                    flex: 0,
                    size: 'sm',
                    text: sticker.message || 'Success',
                    type: 'text',
                    wrap: true,
                  },
                  {
                    flex: 1,
                    layout: 'vertical',
                    type: 'box',
                    contents: [],
                  },
                ],
              },
            ],
          },
        ]),
      ],
    },
    footer: {
      layout: 'vertical',
      spacing: 'sm',
      type: 'box',
      contents: [
        {
          height: 'sm',
          style: 'primary',
          type: 'button',
          action: {
            label: nextCmd,
            type: 'message',
            text: `${nextCmd} ${_.map(stickers, s => `${s.packageId} ${s.stickerId}`).join(' ')}`,
          },
        },
        {
          height: 'sm',
          style: 'primary',
          type: 'button',
          action: {
            label: '點此查詢可用貼圖',
            type: 'uri',
            uri: 'https://developers.line.biz/en/docs/messaging-api/sticker-list/',
          },
        },
      ],
    },
  },
})
