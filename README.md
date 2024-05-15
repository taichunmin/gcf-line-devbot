[![Build Status](https://github.com/taichunmin/gcf-line-devbot/workflows/Node.js%20CI/badge.svg)](https://github.com/taichunmin/gcf-line-devbot/actions)

# LINE Flex 開發人員工具

![](https://i.imgur.com/cP5purz.png)

加入好友: <https://line.me/R/ti/p/@736cebrk>

## 功能

1. 直接用 JSON 印出收到的 Event
2. 以文字傳送 Message JSON 就會直接顯示
3. 從 [Flex Message Simulator](https://developers.line.biz/flex-simulator/) 直接貼上複製下來的 JSON 也可以直接顯示

## 如果沒有反應怎麼辦？

1. 由於後端採用 Google Cloud Function，為了避免用量過高被收錢，所以有鎖執行上限，如果無回應的話，可以考慮重新傳送訊息試試喔！
2. 若重送訊息還是沒有回應，就有可能是發送訊息時發生錯誤，由於 replyToken 無法重複使用，所以會直接沒有回應。

## 詳細教學及相關連結

1. 部落格介紹: https://taichunmin.idv.tw/blog/2020-04-06-line-devbot.html
2. 投影片介紹: https://hackmd.io/@taichunmin/COSCUP2022
3. 原始碼: https://github.com/taichunmin/gcf-line-devbot

## LINE Simple Beacon 工作坊測試工具

你可以使用這個 Flex 開發人員工具來幫助你使用 ESP32 來製作一個 LINE Simple Beacon！教學連結在此: <https://taichunmin.idv.tw/blog/2020-07-13-line-simple-beacon-workshop.html>
