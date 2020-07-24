/*
设置起点更新提醒
- 请配合 scf_sign/Novel_Update_Notice 进行使用
- Github地址（https://github.com/Liquor030/scf_sign/tree/master/Novel_Update_Notice）

        by Liquor030
*/

////////////// 配置内容 //////////////
const SecretId = "@@@@@@@@@";
// 填入腾讯云API密钥
const SecretKey = "$$$$$$$$$";
// https://console.cloud.tencent.com/cam/capi
const FunctionName = "&&&&&&&&&";
// 创建的函数名
const Region = "¥¥¥¥¥¥¥¥¥";
// 地域配置为创建函数时选择的地域，可对照README的地域对应表进行填写
const Namespace = "default";
// 命名空间为创建函数时选择的命名空间，默认default
////////////////////////////////////

$app.theme = "auto";

$ui.render({
    props: {
        title: "Set Novel Notice"
    },
    views: [{
            type: "tab",
            props: {
                items: ["起点", "纵横", "晋江"],
                tintColor: $color("#00EEEE")
            },
            layout({
                left,
                height
            }, view) {
                left.top.right.inset(10);
                height.equalTo(32);
            },
            events: {
                changed(sender) {
                    switch (sender.items[sender.index]) {
                        case "起点":
                            Channel = "QDId";
                            break;
                        case "纵横":
                            Channel = "ZHId";
                            break;
                        case "晋江":
                            Channel = "JJId";
                            break;
                    }
                    listView.data = BookList[Channel];
                    console.log(Channel);
                }
            }
        }, {
            type: "input",
            props: {
                placeholder: "Type BookId here..."
            },
            layout({
                top,
                left,
                height,
                width
            }, view) {
                top.equalTo($("tab").bottom).offset(10);
                left.inset(10);
                height.equalTo(32);
                width
                    .equalTo(view.super)
                    .multipliedBy(0.7)
                    .offset(-15);
            },
            events: {
                returned(sender) {
                    insertItem(sender.text, Channel);
                    sender.blur();
                    sender.text = "";
                }
            }
        },
        {
            type: "button",
            props: {
                title: "上传"
            },
            layout({
                left,
                top,
                right
            }) {
                const input = $("input");
                left.equalTo(input.right).offset(10);
                top.height.equalTo(input);
                right.inset(10);
            },
            events: {
                tapped(sender) {
                    let GetData = {
                        FunctionName: FunctionName,
                        Namespace: Namespace
                    };
                    Post("GetFunction", GetData, BookList);
                }
            }
        },
        {
            type: "list",
            props: {
                rowHeight: 64.0,
                footer: {
                    type: "label",
                    props: {
                        height: 20,
                        text: "by Liquor030",
                        textColor: $color("#AAAAAA"),
                        align: $align.center,
                        font: $font(12)
                    }
                },
                actions: [{
                    title: "delete",
                    handler(sender, indexPath) {
                        deleteItem(indexPath, Channel);
                    }
                }],
                template: [{
                        type: "label",
                        props: {
                            id: "title",
                            font: $font(20)
                        },
                        layout({
                            left,
                            top,
                            height
                        }) {
                            left.equalTo(10);
                            top.right.inset(8);
                            height.equalTo(24);
                        }
                    },
                    {
                        type: "label",
                        props: {
                            id: "content",
                            textColor: $color("#888888"),
                            font: $font(15)
                        },
                        layout({
                            left,
                            top,
                            bottom
                        }) {
                            left.right.equalTo($("title"));
                            top.equalTo($("title").bottom);
                            bottom.equalTo(0);
                        }
                    }
                ]
            },
            layout({
                left,
                top
            }) {
                left.bottom.right.equalTo(0);
                top.equalTo($("input").bottom).offset(10);
            },
            events: {
                didSelect(tableView, indexPath) {
                    $clipboard.text = tableView.object(indexPath).content.text;
                    $device.taptic();
                    $ui.toast("BookId 复制成功");
                }
            }
        }
    ]
});

const CryptoJS = require('crypto-js');
const Version = "2018-04-16";
const Host = "scf.tencentcloudapi.com";
const ContentType = "application/json";
const Algorithm = "TC3-HMAC-SHA256";
const SignedHeaders = "content-type;host";

const listView = $("list");
const BookList = $cache.get("BookList") || {
    QDId: [],
    ZHId: [],
    JJId: []
};

switch ($("tab").items[$("tab").index]) {
    case "起点":
        var Channel = "QDId";
        break;
    case "纵横":
        var Channel = "ZHId";
        break;
    case "晋江":
        Channel = "JJId";
        break;
}
listView.data = BookList[Channel];


function insertItem(id, Channel) {
    if (Channel == "QDId") {
        console.log("Channel: 起点");
        $http.get({
            url: "http://druid.if.qidian.com/Atom.axd/Api/Book/GetChapterList?BookId=" + id + "&timeStamp=253402185599000",
            handler: function (resp) {
                let data = resp.data;
                if (data.Result == 0) {
                    let title = data.Data.BookName;
                    let text = {
                        title: {
                            text: title
                        },
                        content: {
                            text: id
                        }
                    };
                    BookList.QDId.unshift(text);
                    listView.insert({
                        index: 0,
                        value: text
                    });
                    saveItems();
                } else {
                    $ui.toast("请输入正确的BookId");
                }
            }
        })
    } else if (Channel == "ZHId") {
        console.log("Channel: 纵横");
        let sign = "082DE6CF1178736AF28EB8065CDBE5ACapi_key=27A28A4D4B24022E543E&bookId=" + id + "082DE6CF1178736AF28EB8065CDBE5AC";
        sign = CryptoJS.MD5(sign).toString();
        $http.post({
            url: "https://api1.zongheng.com/iosapi/shelf/getLastChapters",
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "ZongHeng/6.2.0"
            },
            body: {
                api_key: "27A28A4D4B24022E543E",
                bookId: id,
                sig: sign
            },
            handler: function (resp) {
                let data = resp.data;
                if (data.result.lastChapterList.length > 0) {
                    let title = data.result.lastChapterList[0].bookName;
                    let text = {
                        title: {
                            text: title
                        },
                        content: {
                            text: id
                        }
                    };
                    BookList.ZHId.unshift(text);
                    listView.insert({
                        index: 0,
                        value: text
                    });
                    saveItems();
                } else {
                    $ui.toast("请输入正确的BookId");
                }
            }
        })
    } else if (Channel == "JJId") {
        console.log("Channel: 晋江");
        $http.post({
            url: "http://android.jjwxc.net/androidapi/getNovelBqInfo",
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "JINJIANG-iOS/4.5.2"
            },
            body: {
                novelId: id
            },
            handler: function (resp) {
                let data = resp.data;
                if (data.hasOwnProperty("message") == 0) {
                    let title = data.novelName;
                    let text = {
                        title: {
                            text: title
                        },
                        content: {
                            text: id
                        }
                    };
                    BookList.JJId.unshift(text);
                    listView.insert({
                        index: 0,
                        value: text
                    });
                    saveItems();
                } else {
                    $ui.toast("请输入正确的BookId");
                }
            }
        })
    }
}

function deleteItem({
    row
}, Channel) {
    const text = BookList[Channel][row];
    const index = BookList[Channel].indexOf(text);
    if (index >= 0) {
        BookList[Channel].splice(index, 1);
        saveItems();
    }
}

function saveItems() {
    $cache.set("BookList", BookList);
}

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

function Post(Action, JsonBody, BookList) {
    let StrBody = JSON.stringify(JsonBody)
    let RequestTimestamp = Date.parse(new Date()) / 1000;
    let date = new Date(RequestTimestamp * 1000);
    date = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1 < 10 ? '0' + (date.getUTCMonth() + 1) : date.getUTCMonth() + 1) + '-' + date.getUTCDate();
    let CredentialScope = date + '/scf/tc3_request';
    console.log(Action);
    console.log("PostBody: " + StrBody);
    $http.post({
        url: "https://" + Host,
        header: {
            'Authorization': getAuthorization(StrBody, RequestTimestamp, date, CredentialScope),
            'Content-Type': ContentType,
            'Host': Host,
            'X-TC-Action': Action,
            'X-TC-Timestamp': RequestTimestamp,
            'X-TC-Version': Version,
            'X-TC-Region': Region
        },
        body: $data({
            string: StrBody
        }),
        handler: function (resp) {
            let data = resp.data;
            if (Action == "GetFunction") {
                if (data.Response.hasOwnProperty('Error')) {
                    $ui.toast("读取函数配置失败, " + data.Response.Error.Message);
                    console.log("读取函数配置失败, " + data.Response.Error.Message);
                } else {
                    let Variables = data.Response.Environment.Variables;
                    let BookListStr = JSON.stringify(BookList);
                    var UploadData = {
                        FunctionName: FunctionName,
                        Namespace: Namespace,
                        Environment: {
                            Variables: [{
                                Key: "BookList",
                                Value: BookListStr
                            }]
                        }
                    };
                    for (let i = 0; i < Variables.length; i++) {
                        if (Variables[i].Key == "BookInfo") {
                            let BookInfo = JSON.parse(Variables[i].Value);
                            for (var p in BookInfo) {
                                for (var k in BookInfo[p]) {
                                    if (BookListStr.indexOf(k) == -1) {
                                        delete BookInfo[p][k];
                                    }
                                }
                            }
                            BookInfo = JSON.stringify(BookInfo);
                            Variables_BookInfo = {
                                Key: "BookInfo",
                                Value: BookInfo
                            }
                            UploadData.Environment.Variables.push(Variables_BookInfo)
                            console.log("BookInfo: " + BookInfo);
                        }
                    }
                    console.log("读取成功");
                    Post("UpdateFunctionConfiguration", UploadData, BookList);
                }
            } else {
                if (data.Response.hasOwnProperty('Error')) {
                    $ui.toast("上传失败, " + data.Response.Error.Message);
                    console.log("上传失败, " + data.Response.Error.Message);
                } else {
                    $ui.toast("上传成功");
                    console.log("上传成功");
                }
            }
        }
    })
}