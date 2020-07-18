'use strict';
exports.main_handler = async (event, context, callback) => {
    const fetch = require('node-fetch');

    //////////// 配置 ////////////
    const rate = 60; // 注意: 更改此项需要配合正确的定时触发使用，默认60秒。
    const ids = [1018027842]; // 填入需要获取更新通知的起点书籍id
    const Bark_Key = "#########"; // 填入你自己的Bark_Key
    /////////////////////////////

    function refreshUpdateinfo(id) {
        fetch('http://druid.if.qidian.com/Atom.axd/Api/Book/GetChapterList?BookId=' + id + '&timeStamp=253402185599000')
            .then(res => res.json())
            .then(json => {
                if (json.Result == 0) {
                    let obj = json.Data.LastVipChapterUpdateTime ? 'LastVip' : 'Last';
                    let DiffTime = now - json.Data[obj+'ChapterUpdateTime']
                    if (DiffTime <= rate && DiffTime > 0)
                    {
                        console.log(json.Data.BookName + ': ' + json.Data[obj+'UpdateChapterName']);
                        Push(json.Data.BookName, json.Data.Author, json.Data[obj+'UpdateChapterName'], Bark_Key);
                    }
                    else
                    {
                        console.log(json.Data.BookName + ': 暂无更新');
                    }
                } else {
                    console.log('id_' + id + ':' + json.Message);
                }
            });
    }

    function Push(BookName, Author, Chapter, Bark_Key) {
        fetch('https://api.day.app/' + Bark_Key + '/' + encodeURIComponent('《' + BookName + '》') + '/' + encodeURIComponent(Chapter) + '?url=' + encodeURIComponent('iFreeTime://bk/a=' + encodeURIComponent(Author) + '&n=' + encodeURIComponent(BookName) + '&d=0'))
            .then(res => res.json())
            .then(json => console.log(json.message));
    }

    var now = new Date().getTime();
    now -= (now % (rate * 1000));
    console.log("refresh_timeStamp: " + now);

    for (let i = 0; i < ids.length; i++) {
        refreshUpdateinfo(ids[i]);
    }

    return 1
};