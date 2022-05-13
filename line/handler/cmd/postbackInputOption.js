const msgSendTextToBot = require('../../msg/send-text-to-bot')

const msgDemo = {
  type: 'flex',
  altText: '測試 inputOption 屬性（限手機）',
  contents: {
    type: 'bubble',
    body: {
      borderColor: '#08c356',
      borderWidth: '10px',
      layout: 'vertical',
      paddingAll: '10px',
      spacing: 'sm',
      type: 'box',
      contents: [
        {
          color: '#08c356',
          style: 'primary',
          type: 'button',
          action: {
            data: 'actionId=61',
            inputOption: 'closeRichMenu',
            label: 'closeRichMenu',
            type: 'postback',
          },
        },
        {
          color: '#08c356',
          style: 'primary',
          type: 'button',
          action: {
            data: 'actionId=62',
            inputOption: 'openRichMenu',
            label: 'openRichMenu',
            type: 'postback',
          },
        },
        {
          color: '#08c356',
          style: 'primary',
          type: 'button',
          action: {
            data: 'actionId=63',
            fillInText: '---\n這是預先填寫的文字\n---',
            inputOption: 'openKeyboard',
            label: 'openKeyboard',
            type: 'postback',
          },
        },
        {
          color: '#08c356',
          style: 'primary',
          type: 'button',
          action: {
            data: 'actionId=64',
            inputOption: 'openVoice',
            label: 'openVoice',
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
          text: '測試 inputOption 屬性（限手機）',
          type: 'text',
        },
      ],
    },
  },
  quickReply: {
    items: [
      {
        type: 'action',
        action: {
          data: 'actionId=61',
          inputOption: 'closeRichMenu',
          label: 'closeRichMenu',
          type: 'postback',
        },
      },
      {
        type: 'action',
        action: {
          data: 'actionId=62',
          inputOption: 'openRichMenu',
          label: 'openRichMenu',
          type: 'postback',
        },
      },
      {
        type: 'action',
        action: {
          data: 'actionId=63',
          fillInText: '---\n這是預先填寫的文字\n---',
          inputOption: 'openKeyboard',
          label: 'openKeyboard',
          type: 'postback',
        },
      },
      {
        type: 'action',
        action: {
          data: 'actionId=64',
          inputOption: 'openVoice',
          label: 'openVoice',
          type: 'postback',
        },
      },
    ],
  },
}

module.exports = async (ctx, next) => {
  const isFromUser = ctx?.event?.source?.type === 'user'
  await ctx.replyMessage(isFromUser ? msgDemo : msgSendTextToBot({
    title: '測試 inputOption',
    body: '請在手機上點選下方按鈕，加入 LINE 官方帳號，然後送出文字，即可測試 postback 動作的 inputOption 屬性。',
    text: '/postbackInputOption',
  }))
}
