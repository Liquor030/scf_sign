#!/usr/bin/env python
# -*- coding:utf-8 -*-
import requests
import json
import os

############ 配置 ############
url_list = [
    # [url,file_name],
    ["https://example2.com/xxxxxx", "example1"],
    ["https://example1.xyz/xxxxxx", "example2"]
]
#############################

class Update:
    # gist api post
    data = {
        "description": "proxy providers",
        "files": {
        }
    }

    # 返回
    return_body = ""

    # 更新状态
    isUpdated = False

    def Get_Node(self, url, file_name):
        # New
        new = requests.get(url)
        if new.status_code == requests.codes["ok"]:
            # Old
            old = requests.get("https://gist.githubusercontent.com/" + os.environ.get(
                'gist_owner') + "/" + os.environ.get('gist_id') + "/raw/" + file_name)

            if old.status_code != requests.codes["ok"] or old.text != new.text:
                self.data["files"][file_name] = {
                    "content": new.text
                }
                self.return_body += file_name + ": 更新成功\n"
                self.isUpdated = True
            else:
                self.return_body += file_name + ": 未发现更新\n"
        else:
            self.return_body += file_name + ": 请求失败\n"


def main_handler(event, context):
    update = Update()

    for url in url_list:
        update.Get_Node(url[0], url[1])

    if update.isUpdated == True:
        str_data = json.dumps(update.data)
        header = {'Authorization': 'token ' + os.environ.get('gist_token')}
        requests.post('https://api.github.com/gists/' +
                      os.environ.get('gist_id'), data=str_data, headers=header)

    return {
        "isBase64Encoded": False,
        "statusCode": 200,
        "headers": {"Content-Type": "text/plain; charset=utf-8"},
        "body": update.return_body
    }
