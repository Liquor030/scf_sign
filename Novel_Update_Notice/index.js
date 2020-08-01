'use strict';
////////////// 配置内容 //////////////
const Bark_Key = "#########";
// 填入你自己的Bark_Key
const SecretId = "@@@@@@@@@";
// 填入腾讯云API密钥
const SecretKey = "$$$$$$$$$";
// https://console.cloud.tencent.com/cam/capi
const FunctionName = "&&&&&&&&&";
// 创建的函数名称
const Region = "¥¥¥¥¥¥¥¥¥";
// 地域配置为创建函数时选择的地域，可对照README的地域对应表进行填写
const Namespace = "default";
// 命名空间为创建函数时选择的命名空间，默认default
////////////// 配置内容 //////////////

const fetch = require('node-fetch');
const CryptoJS = require('crypto-js');

const Action = "UpdateFunctionConfiguration"
const Version = "2018-04-16";
const Host = "scf.tencentcloudapi.com";
const ContentType = "application/json";
const Algorithm = "TC3-HMAC-SHA256";
const SignedHeaders = "content-type;host";

exports.main_handler = async (event, context, callback) => {
    function getCanonicalRequest(Data) {
        let HTTPRequestMethod = "POST";
        let CanonicalURI = "/";
        let CanonicalQueryString = "";
        let CanonicalHeaders = "content-type:" + ContentType + "\nhost:" + Host + "\n";
        let HashedRequestPayload = CryptoJS.SHA256(Data).toString();
        let CanonicalRequest = HTTPRequestMethod + '\n' +
            CanonicalURI + '\n' +
            CanonicalQueryString + '\n' +
            CanonicalHeaders + '\n' +
            SignedHeaders + '\n' +
            HashedRequestPayload;
        return CanonicalRequest;
    }

    function getStringToSign(CanonicalRequest, RequestTimestamp, CredentialScope) {
        let HashedCanonicalRequest = CryptoJS.SHA256(CanonicalRequest).toString();
        let StringToSign = Algorithm + '\n' +
            RequestTimestamp + '\n' +
            CredentialScope + '\n' +
            HashedCanonicalRequest;
        return StringToSign;
    }

    function getSecretSigning(Date, Service) {
        let SecretDate = CryptoJS.HmacSHA256(Date, "TC3" + SecretKey);
        let SecretService = CryptoJS.HmacSHA256(Service, SecretDate);
        let SecretSigning = CryptoJS.HmacSHA256("tc3_request", SecretService);
        return SecretSigning;
    }

    function getAuthorization(body, RequestTimestamp, Date, CredentialScope) {
        let StringToSign = getStringToSign(getCanonicalRequest(body), RequestTimestamp, CredentialScope);

        let Signature = CryptoJS.HmacSHA256(StringToSign, getSecretSigning(Date, "scf")).toString();

        let Authorization = Algorithm + ' ' +
            'Credential=' + SecretId + '/' + CredentialScope + ', ' +
            'SignedHeaders=' + SignedHeaders + ', ' +
            'Signature=' + Signature;
        
        console.log("\nAuthorization: " + Authorization);
        return Authorization;
    }

    function Post(JsonBody) {
        let StrBody = JSON.stringify(JsonBody)
        let RequestTimestamp = Date.parse(new Date()) / 1000;
        let date = new Date(RequestTimestamp * 1000);
        date = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1 < 10 ? '0' + (date.getUTCMonth() + 1) : date.getUTCMonth() + 1) + '-' + (date.getUTCDate() < 10 ? '0' + date.getUTCDate() : date.getUTCDate());
        let CredentialScope = date + '/scf/tc3_request';


        fetch("https://" + Host, {
                method: 'POST',
                headers: {
                    'Authorization': getAuthorization(StrBody, RequestTimestamp, date, CredentialScope),
                    'Content-Type': ContentType,
                    'Host': Host,
                    'X-TC-Action': Action,
                    'X-TC-Timestamp': RequestTimestamp,
                    'X-TC-Version': Version,
                    'X-TC-Region': Region
                },
                body: StrBody
            }).then(response => response.json())
            .then(responseJsonData => {
                if (responseJsonData.Response.hasOwnProperty('Error')) {
                    console.log("上传失败, " + responseJsonData.Response.Error.Message);
                } else {
                    console.log("上传成功");
                }
            })
    }

    function Bark(BookName, Author, Chapter, Bark_Key) {
        fetch('https://api.day.app/' + Bark_Key + '/' + encodeURIComponent('《' + BookName + '》') + '/' + encodeURIComponent(Chapter) + '?url=' + encodeURIComponent('iFreeTime://bk/a=' + encodeURIComponent(Author) + '&n=' + encodeURIComponent(BookName) + '&d=0'))
            .then(res => res.json())
            .then(json => console.log(json.message));
    }

    // 更新cid信息
    function refreshVariables(id, BookName, Author, new_cid, UpdateChapterName, Channel) {
        if (process.env.hasOwnProperty('BookInfo') && process.env.BookInfo.indexOf('"' + id + '"') != -1) {
            let BookInfo = JSON.parse(process.env.BookInfo);
            let old_cid = BookInfo[Channel][id];
            console.log('\n(' + id + ')' + BookName + '的 old_cid: ' + old_cid);
            if (old_cid >= new_cid) {
                new_cid = old_cid;
                console.log('\n(' + id + ')' + BookName + ': 暂无更新, 最新章节为 ' + UpdateChapterName + '(' + new_cid + ')');
            } else {
                console.log('\n(' + id + ')' + BookName + '_更新章节: ' + UpdateChapterName + '(' + new_cid + ')');
                Bark(BookName, Author, UpdateChapterName, Bark_Key);
                flag = 0;
            }
        } else {
            Bark(BookName, Author, UpdateChapterName, Bark_Key);
            console.log('\n添加成功！(' + id + ')' + BookName + '_更新章节: ' + UpdateChapterName + '(' + new_cid + ')');
            flag = 0;
        }
        BookInfo[Channel][id] = new_cid;
    }

    async function refreshUpdateinfo(id, Channel) {
        if (Channel == "QDId") {
            await fetch('http://druid.if.qidian.com/Atom.axd/Api/Book/GetChapterList?BookId=' + id + '&timeStamp=253402185599000')
                .then(res => res.json())
                .then(json => {
                    if (json.Result == 0) {
                        let BookName = json.Data.BookName;
                        let Author = json.Data.Author;
                        let obj = json.Data.LastVipUpdateChapterId ? 'LastVip' : 'Last';
                        let new_cid = json.Data[obj + 'UpdateChapterId'];
                        let UpdateChapterName = json.Data[obj + 'UpdateChapterName'];
                        console.log('\n(' + id + ')' + BookName + '_更新时间: ' + json.Data[obj + 'ChapterUpdateTime']);
                        refreshVariables(id, BookName, Author, new_cid, UpdateChapterName, "QD")
                    } else {
                        console.log('\n(' + id + ')' + BookName + '_错误: ' + json.Message);
                    }
                })
        } else if (Channel == "ZHId") {
            let sign = "082DE6CF1178736AF28EB8065CDBE5ACapi_key=27A28A4D4B24022E543E&bookId=" + id + "&clientVersion=6.2.0082DE6CF1178736AF28EB8065CDBE5AC";
            sign = CryptoJS.MD5(sign).toString();
            let bodystr = "api_key=27A28A4D4B24022E543E&bookId=" + id + "&clientVersion=6.2.0&sig=" + sign;
            await fetch('https://api1.zongheng.com/iosapi/book/bookInfo', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "User-Agent": "ZongHeng/6.2.0"
                    },
                    body: bodystr
                })
                .then(res => res.json())
                .then(json => {
                    if (json.result != null) {
                        let BookName = json.result.name;
                        let Author = json.result.authorName;
                        let new_cid = json.result.latestChapterId;
                        let UpdateChapterName = json.result.latestChapterName;
                        console.log('\n(' + id + ')' + BookName + '_更新时间: ' + json.result.updateTime);
                        refreshVariables(id, BookName, Author, new_cid, UpdateChapterName, "ZH")
                    } else {
                        console.log('\n(' + id + ')' + BookName + '_错误: ' + json.message);
                    }
                })
        } else if (Channel == "JJId") {
            await fetch('http://app-ios-cdn.jjwxc.net/iosapi/novelbasicinfo?novelId=' + id, {
                    headers: {
                        "User-Agent": "JINJIANG-iOS/4.5.2"
                    }
                })
                .then(res => res.json())
                .then(json => {
                    if (json.hasOwnProperty("message") == 0) {
                        let BookName = json.novelName;
                        let Author = json.authorName;
                        let new_cid = json.renewChapterId;
                        let UpdateChapterName = json.renewChapterName;
                        console.log('\n(' + id + ')' + BookName + '_更新时间: ' + json.renewDate);
                        refreshVariables(id, BookName, Author, new_cid, UpdateChapterName, "JJ")
                    } else {
                        console.log('\n(' + id + ')' + BookName + '_错误: ' + json.message);
                    }
                })
        }

    }

    async function _refreshUpdateinfo(BookList) {
        for (var p in BookList) {
            for (let i = 0; i < BookList[p].length; i++) {
                await refreshUpdateinfo(BookList[p][i].content.text, p);
            }
        }
    }

    async function main() {
        if (process.env.hasOwnProperty("BookList")) {
            var BookList = JSON.parse(process.env.BookList);
            await _refreshUpdateinfo(BookList);
            if (flag) {
                console.log('\n' + '所有书籍均无更新！');
            } else {
                Data.Environment.Variables[0].Value = process.env.BookList;
                Data.Environment.Variables[1].Value = JSON.stringify(BookInfo);
                Post(Data);
            }
        } else {
            console.log('\n' + '请先在环境变量中添加BookList！');
        }
    }

    var flag = 1;
    // 构造请求体
    var Data = {
        FunctionName: FunctionName,
        Namespace: Namespace,
        Environment: {
            Variables: [{
                    Key: "BookList",
                    Value: ""
                },
                {
                    Key: "BookInfo",
                    Value: ""
                }
            ]
        }
    }
    // BookInfo 
    var BookInfo = {
        QD: {},
        ZH: {},
        JJ: {}
    }

    main();

    return 1;
};