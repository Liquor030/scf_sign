/*
设置起点更新提醒
- 请配合 scf_sign/QD_refreshUpdateinfo 进行使用
- Github地址（https://github.com/Liquor030/scf_sign/tree/master/QD_refreshUpdateinfo）

        by Liquor030
*/

////////////// 配置内容 //////////////
const SecretId = "@@@@@@@@@";       // 填入腾讯云API密钥
const SecretKey = "$$$$$$$$$";      // https://console.cloud.tencent.com/cam/capi
const FunctionName = "&&&&&&&&&";   // 创建的函数名
const Region = "¥¥¥¥¥¥¥¥¥";         // 地域配置为创建函数时选择的地域，可对照README的地域对应表进行填写
////////////////////////////////////

$app.theme = "auto";

$ui.render({
    props: {
        title: "Set QD Notice"
    },
    views: [{
            type: "input",
            props: {
                placeholder: "Type BookId here..."
            },
            layout({
                left,
                height,
                width
            }, view) {
                left.top.inset(10);
                height.equalTo(32);
                width
                    .equalTo(view.super)
                    .multipliedBy(0.7)
                    .offset(-15);
            },
            events: {
                returned(sender) {
                    insertItem(sender.text);
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
                    let BookArr = [];
                    for (let i = 0; i < listView.data.length; i++) {
                        BookArr.push(listView.data[i].content.text)
                    }
                    let BookList = BookArr.join(",")
                    console.log(BookList);
                    let GetData = {
                        FunctionName: FunctionName
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
                        deleteItem(indexPath);
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
const BookId = $cache.get("BookId") || [];
listView.data = BookId;

function insertItem(id) {
    $http.request({
        method: "Get",
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
                BookId.unshift(text);
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

function deleteItem({
    row
}) {
    const text = BookId[row];
    const index = BookId.indexOf(text);
    if (index >= 0) {
        BookId.splice(index, 1);
        saveItems();
    }
}

function saveItems() {
    $cache.set("BookId", BookId);
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
    let date = new Date((RequestTimestamp - 28800) * 1000);
    date = date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + date.getDate();
    let CredentialScope = date + '/scf/tc3_request';

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
            console.log(Action);
            if (Action == "GetFunction") {
                if (data.Response.hasOwnProperty('Error')) {
                    $ui.toast("读取函数配置失败, " + data.Response.Error.Message);
                    console.log("读取函数配置失败, " + data.Response.Error.Message);
                } else {
                    Variables = data.Response.Environment.Variables;
                    var UploadData = {
                        FunctionName: FunctionName,
                        Environment: {
                            Variables: [{
                                Key: "BookList",
                                Value: BookList
                            }]
                        }
                    };
                    for (let i = 0; i < Variables.length; i++) {
                        if (Variables[i].Key == "BookInfo") {
                            let BookInfo = JSON.parse(Variables[i].Value);
                            for (var p in BookInfo.QD) {
                                if (BookList.indexOf(p) == -1) {
                                    delete BookInfo.QD[p];
                                }
                            }
                            BookInfo = JSON.stringify(BookInfo);
                            Variables_BookInfo = {
                                Key: "BookInfo",
                                Value: BookInfo
                            }
                            UploadData.Environment.Variables.push(Variables_BookInfo)
                            console.log(BookInfo);
                        }
                    }
                    Post("UpdateFunctionConfiguration", UploadData, BookList);
                    console.log("读取成功");
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