'use strict';
exports.main_handler = async (event, context, callback) => {

    //////////// 配置 ////////////
    const ids = [1018027842, 1016572786]; // 填入需要获取更新通知的起点书籍id
    const Bark_Key = "#########"; // 填入你自己的Bark_Key
    const SecretId = "@@@@@@@@@"; // 填入腾讯云API密钥
    const SecretKey = "$$$$$$$$$"; // https://console.cloud.tencent.com/cam/capi
    const FunctionName = "&&&&&&&&&"; // 创建的函数名称
    const Region = "ap-shanghai"; // 地域配置为创建函数时所选择的地域，默认上海
    /////////////////////////////

    const fetch = require('node-fetch');
    const tencentcloud = require("tencentcloud-sdk-nodejs");
    const ScfClient = tencentcloud.scf.v20180416.Client;
    const models = tencentcloud.scf.v20180416.Models;
    const Credential = tencentcloud.common.Credential;
    const ClientProfile = tencentcloud.common.ClientProfile;
    const HttpProfile = tencentcloud.common.HttpProfile;

    async function refreshUpdateinfo(id) {
        await fetch('http://druid.if.qidian.com/Atom.axd/Api/Book/GetChapterList?BookId=' + id + '&timeStamp=253402185599000')
            .then(res => res.json())
            .then(json => {
                if (json.Result == 0) {
                    let obj = json.Data.LastVipUpdateChapterId ? 'LastVip' : 'Last';
                    console.log('\n' + json.Data.BookName + '_更新时间: ' + json.Data[obj + 'ChapterUpdateTime']);
                    if (process.env['bid_' + id] == undefined) {
                        console.log('\n' + json.Data.BookName + '_更新章节: ' + json.Data[obj + 'UpdateChapterName']);
                        Bark(json.Data.BookName, json.Data.Author, json.Data[obj + 'UpdateChapterName'], Bark_Key);
                        refreshVariables(id, json.Data[obj + 'UpdateChapterId']);
                    } else {
                        if (process.env['bid_' + id] == json.Data[obj + 'UpdateChapterId']) {
                            console.log('\n' + json.Data.BookName + ': 暂无更新');
                        } else {
                            console.log('\n' + json.Data.BookName + '_更新章节: ' + json.Data[obj + 'UpdateChapterName']);
                            Bark(json.Data.BookName, json.Data.Author, json.Data[obj + 'UpdateChapterName'], Bark_Key);
                            refreshVariables(id, json.Data[obj + 'UpdateChapterId']);
                        }
                    }
                } else {
                    console.log('\n' + 'id_' + id + ':' + json.Message);
                }
            })
    }

    function Bark(BookName, Author, Chapter, Bark_Key) {
        fetch('https://api.day.app/' + Bark_Key + '/' + encodeURIComponent('《' + BookName + '》') + '/' + encodeURIComponent(Chapter) + '?url=' + encodeURIComponent('iFreeTime://bk/a=' + encodeURIComponent(Author) + '&n=' + encodeURIComponent(BookName) + '&d=0'))
            .then(res => res.json())
            .then(json => console.log(json.message));
    }

    function refreshVariables(bookId, LastUpdateChapterID) {
        let book = {
            Key: 'bid_' + bookId,
            Value: LastUpdateChapterID.toString()
        }
        BookInfo.Environment.Variables.push(book)
    }

    function refreshEnvironment() {
        let cred = new Credential(SecretId, SecretKey);
        let httpProfile = new HttpProfile();
        httpProfile.endpoint = "scf.tencentcloudapi.com";
        let clientProfile = new ClientProfile();
        clientProfile.httpProfile = httpProfile;
        let client = new ScfClient(cred, Region, clientProfile);
        let req = new models.UpdateFunctionConfigurationRequest();
        let params = JSON.stringify(BookInfo);
        req.from_json_string(params);

        client.UpdateFunctionConfiguration(req, function (errMsg, response) {
            if (errMsg) {
                console.log(errMsg);
                return;
            }
            console.log(response.to_json_string());
        });
    }

    async function _refreshUpdateinfo() {
        for (let i = 0; i < ids.length; i++) {
            await refreshUpdateinfo(ids[i]);
        }
    }

    async function main() {
        await _refreshUpdateinfo();
        refreshEnvironment();
    }

    var BookInfo = JSON.parse('{\"FunctionName\":\"' + FunctionName + '\",\"Environment\":{\"Variables\":[]}}')
    main();

    return 1
};