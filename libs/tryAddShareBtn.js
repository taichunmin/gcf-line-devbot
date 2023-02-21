const _ = require('lodash')
const { beautifyFlex, encodeBase64url, log } = require('./helper')
const { octokit } = require('./octokit')
const JSON5 = require('json5')

const flexShareBtn = ({ uri, gistId }) => ({
  altText: '點此透過 LINE 數位版名片分享',
  type: 'flex',
  contents: {
    type: 'carousel',
    contents: [
      {
        size: 'nano',
        type: 'bubble',
        body: {
          alignItems: 'center',
          justifyContent: 'center',
          layout: 'horizontal',
          paddingAll: '5px',
          spacing: 'md',
          type: 'box',
          action: {
            type: 'uri',
            uri,
          },
          contents: [
            {
              height: '16px',
              layout: 'vertical',
              type: 'box',
              width: '16px',
              contents: [
                {
                  aspectMode: 'cover',
                  aspectRatio: '1:1',
                  size: 'full',
                  type: 'image',
                  url: 'https://i.imgur.com/IFjR25G.png',
                },
              ],
            },
            {
              flex: 0,
              size: '16px',
              text: '分享',
              type: 'text',
            },
          ],
        },
      },
      {
        size: 'nano',
        type: 'bubble',
        body: {
          alignItems: 'center',
          justifyContent: 'center',
          layout: 'horizontal',
          paddingAll: '5px',
          spacing: 'md',
          type: 'box',
          action: {
            data: '/gistReplaceAltText',
            displayText: '如果你是在手機上點選「改替代」按鈕，你應該可以在下方輸入框看到自動填寫的文字指令，請在指令後面輸入新的替代文字後傳送。',
            fillInText: `/gistReplaceAltText ${gistId} `,
            inputOption: 'openKeyboard',
            type: 'postback',
          },
          contents: [
            {
              height: '16px',
              layout: 'vertical',
              type: 'box',
              width: '16px',
              contents: [
                {
                  aspectMode: 'cover',
                  aspectRatio: '1:1',
                  size: 'full',
                  type: 'image',
                  url: 'https://i.imgur.com/dLElEk7.png',
                },
              ],
            },
            {
              flex: 0,
              size: '16px',
              text: '改替代',
              type: 'text',
            },
          ],
        },
      },
    ],
  },
  sender: {
    iconUrl: 'https://i.imgur.com/1KZoSue.png',
    name: '數位版名片',
  },
})

exports.tryAddShareBtn = async (ctx, msg) => {
  try {
    if (!octokit) throw new Error() // 未設定 OCTOKIT_ACCESS_TOKEN
    if (_.isArray(msg) && msg.length >= 5) throw new Error() // 沒有辦法新增分享按鈕
    const { describeEventSource, event } = ctx
    const filename = `gcf-line-devbot-${event?.message?.id}.json5`
    const gist = await octokit.request('POST /gists', {
      description: describeEventSource,
      files: { [filename]: { content: JSON5.stringify(beautifyFlex(msg)) } },
    })
    const uri = `https://lihi1.com/kLzL9/${encodeBase64url(gist.data.files[filename].raw_url)}`
    return [flexShareBtn({ uri, gistId: gist.data.id }), ..._.castArray(msg)]
  } catch (err) {
    if (err.message) log('ERROR', err)
    return msg
  }
}
