# Update Nodes
> 仅供测试使用

## 创建函数

- 在[腾讯云函数](https://console.cloud.tencent.com/scf/index/1)中，新建**py3.6**的**空白函数**  

- 创建完毕后  
函数配置-超时时间-**30秒**  
函数配置-环境变量（见下表）  

- 复制index.py中的内容，填入函数代码  

- 配置函数
```
url_list = [
    # [订阅链接,生成的gist文件名],
    ["https://example2.com/xxxxxx", "example1"],
    ["https://example1.xyz/xxxxxx", "example2"]
]
```

#### 环境变量

|key|value|
|:-:|:-:|
|`gist_owner`|Github用户名|
|`gist_token`|Personal Access Token（[点击创建](https://github.com/settings/tokens/new?scopes=gist&description=scf_gist)）|
|`gist_id`|创建 **私密** gist的id（[点击创建](https://gist.github.com)）|

## 触发管理
进入创建好的函数，触发管理，添加并选择适合自己的触发方式  
#### 定时触发
> 定时每天自动更新节点信息

例如：  
名称：`自行决定`  
触发周期：`自定义触发周期`  
Cron表达式：`0 0 9 * * * *`（每天九点执行）

#### API网关触发器
> 可以用来使用api手动更新节点信息  

勾选 `启用集成响应`

## 成功
通过 `https://gist.githubusercontent.com/xxxx(Github用户名)/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx(gist_id)/raw/file_name(生成的gist文件名)` 访问对应节点信息。
