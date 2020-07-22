# Qidian 检测更新
> 仅供测试使用

## 创建空白函数

在[腾讯云函数](https://console.cloud.tencent.com/scf/index/1)中，新建**Nodejs12.16**的**空白函数**。  
创建完毕后 函数配置-超时时间-10秒  //  函数配置-内存-64MB

## 函数内容
复制`index.js`中的内容，填入函数代码中的`index.js`   
新建一个`package.json`文件，并将本项目中的`package.json`复制进去。  
上传方式选择 **在线安装依赖**，并上传测试。

## 替换
```
将 ######### 替换为 IOS上的《Bark》app属于自己的Bark_key  

将 @@@@@@@@@ 与 $$$$$$$$$ 替换为腾讯云API密钥（https://console.cloud.tencent.com/cam/capi）  

将 &&&&&&&&& 替换为 函数配置 - 函数名称  

将 ¥¥¥¥¥¥¥¥¥ 替换为创建函数时选择的地域所对应的取值，详细参考下方的地域对应表
  
```   
  
### 地域对应表
|地域|取值|
|:-:|:-:|
|华南地区（广州）|`ap-guangzhou`|
|华东地区（上海）|`ap-shanghai`|
|华北地区（北京）|`ap-beijing`|
|西南地区（成都）|`ap-chengdu`|
|港澳台地区（中国香港）|`ap-hongkong`|
|亚太南部（孟买）|`ap-mumbai`|
|亚太东南（新加坡）|`ap-singapore`|
|亚太东北（东京）|`ap-tokyo`|
|北美地区（多伦多）|`na-toronto`|
|美国西部（硅谷）|`na-siliconvalley`|   

替换完后点击**保存**，并测试。

## 设置更新提醒  
> 下列两种方法，任选其一  
- **JSBox**  
使用脚本Set QD Notice来设置更新提醒  
[下载 Set QD Notice](https://xteko.com/redir?name=Set+QD+Notice&icon=icon_166.png&version=1.0&author=Liquor030&website=https://github.com/Liquor030/scf_sign/tree/master/QD_refreshUpdateinfo&url=https://raw.githubusercontent.com/Liquor030/scf_sign/master/QD_refreshUpdateinfo/JSBox/SetQDNotice.js)    
<br/>
- **环境变量**  
添加环境变量，函数配置-环境变量  
`key: BookList`  
`value: 1017580377,1018027842,1016572786`  *将此处修改为需要提醒的书籍的ID，用','隔开*  
  

## 定时触发
进入创建好的函数，触发管理，添加并选择适合自己的触发方式  

例如：  
每60s触发
名称：`自行决定`  
触发周期：`每一分钟（每分钟0秒执行一次）`  
Cron表达式：`0 */1 * * * * *`

每30s触发  
名称：`自行决定`  
触发周期：`自定义触发周期`  
Cron表达式：`*/30 * * * * * *`
