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

        return Authorization;
    }

    function Post(JsonBody) {
        let StrBody = JSON.stringify(JsonBody)
        let RequestTimestamp = Date.parse(new Date()) / 1000;
        let date = new Date(RequestTimestamp * 1000);
        date = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1 < 10 ? '0' + (date.getUTCMonth() + 1) : date.getUTCMonth() + 1) + '-' + date.getUTCDate();
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

    // 添加cid
    function refreshVariables(bid, cid) {
        BookInfo.QD[bid] = cid;
    }

    async function refreshUpdateinfo(id) {
        await fetch('http://druid.if.qidian.com/Atom.axd/Api/Book/GetChapterList?BookId=' + id + '&timeStamp=253402185599000')
            .then(res => res.json())
            .then(json => {
                if (json.Result == 0) {
                    let BookName = json.Data.BookName;
                    let Author = json.Data.Author;
                    let obj = json.Data.LastVipUpdateChapterId ? 'LastVip' : 'Last';
                    let new_cid = json.Data[obj + 'UpdateChapterId'];
                    let UpdateChapterName = json.Data[obj + 'UpdateChapterName'];
                    console.log('\n' + id + '_' + BookName + '_更新时间: ' + json.Data[obj + 'ChapterUpdateTime']);
                    if (process.env.hasOwnProperty('BookInfo') && process.env.BookInfo.indexOf('"' + id + '"') != -1) {
                        let BookInfo = JSON.parse(process.env.BookInfo);
                        let old_cid = BookInfo.QD[id];
                        console.log('\n' + id + '_' + BookName + '_old_cid= ' + old_cid);
                        if (old_cid >= new_cid) {
                            console.log('\n' + BookName + ': 暂无更新');
                            refreshVariables(id, old_cid);
                        } else {
                            console.log('\n' + BookName + '_更新章节: ' + UpdateChapterName + '_' + new_cid);
                            Bark(BookName, Author, UpdateChapterName, Bark_Key);
                            refreshVariables(id, new_cid);
                            flag = 0;
                        }
                    } else {
                        Bark(BookName, Author, UpdateChapterName, Bark_Key);
                        refreshVariables(id, new_cid);
                        console.log('\n添加成功！ ' + BookName + '_更新章节: ' + UpdateChapterName + '_' + new_cid);
                        flag = 0;
                    }
                } else {
                    console.log('\n' + 'id_' + id + ':' + json.Message);
                }
            })
    }

    async function _refreshUpdateinfo(BookList) {
        for (let i = 0; i < BookList.length; i++) {
            await refreshUpdateinfo(BookList[i]);
        }
    }

    async function main() {
        if (process.env.hasOwnProperty("BookList")) {
            var BookList = process.env.BookList.split(",");
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
        QD: {}
    }

    main();

    return 1;
};