'use strict';
exports.main_handler = async (event, context, callback) => {
    const fetch = require('node-fetch');
    const ids = [1018027842]; // 填入需要获取更新通知的起点书籍id
    const Bark_Key = "#########"; // 填入你自己的Bark_Key

    function refreshUpdateinfo(id) {
        fetch('http://druid.if.qidian.com/Atom.axd/Api/Book/GetChapterList?BookId=' + id + '&timeStamp=' + time)
            .then(res => res.json())
            .then(json => {
                if (json.Result == -101) {
                    console.log('id_' + id + ':' + json.Message);
                } else {
                    let len = json.Data.Chapters.length;
                    if (len == 0) {
                        console.log(json.Data.BookName + ': 暂无更新');
                    } else {
                        console.log(json.Data.BookName + ': ' + json.Data.Chapters[len - 1].n);
                        Push(json.Data.BookName, json.Data.Author, json.Data.Chapters[len - 1].n, Bark_Key);
                    }
                }
            });
    }

    function Push(BookName, Author, Chapter, Bark_Key) {
        fetch('https://api.day.app/' + Bark_Key + '/' + encodeURIComponent('《' + BookName + '》') + '/' + encodeURIComponent(Chapter) + '?url=' + encodeURIComponent('iFreeTime://bk/a=' + encodeURIComponent(Author) + '&n=' + encodeURIComponent(BookName) + '&d=0'))
            .then(res => res.json())
            .then(json => console.log(json.message));
    }

    var time = new Date().getTime();
    time -= (time % (60000) + 60000);
    console.log("refresh_timeStamp: "+time);
    
    for (let i = 0; i < ids.length; i++) {
        refreshUpdateinfo(ids[i]);
    }

    return 1
};