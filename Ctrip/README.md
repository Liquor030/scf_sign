# Ctrip 签到
> 仅供测试使用

## 创建空白函数

在[腾讯云函数](https://console.cloud.tencent.com/scf/index/1)中，新建**py2.7**的**空白函数**

## 签到函数
复制ctrip.py中的内容，填入函数代码。

#### cookie
##### 获取
1.打开 小程序 并登陆需要签到的账号，最好手机登录

2.开始抓包，抓包教程自行百度

3.打开 小程序-我的-签到 界面

4.在抓包工具中找到请求`https://m.ctrip.com/restapi/soa2/16575/getUserInfo`，并复制发送(Request)的消息体(body)

##### 替换
```
********* 替换为 发送(Request)的消息体(body)  
例如: sign_data = '*********'   ====>>>  sign_data = '{"openId":"xxxx","head":{"cid":"xxxxxx","ctok":"","cver":"1.1.67","lang":"01","sid":"","syscode":"30","auth":"xxxxxx","sauth":"","extension":[{"name":"appId","value":"xxxxxxx"},{"name":"xxxx","value":"1001"}]}}'  
```

#### 以下这些功能不需要可以自行注释掉  
```
1.推送签到结果(无感推送，可查历史记录)  
######### 替换为 微信小程序 iGot 属于自己的key  

2.签到失败时通过微信通知  
$$$$$$$$$ 替换为 Server酱(http://sc.ftqq.com) 中属于自己的SCKEY  
```

#### 如果需要正常推送(有感推送，无历史记录)
请进行以下替换  
```
第13行的  iGot_Key = '#########'  
              ===>>>   Brak_Key = '#########'
第23行的  requests.get('https://push.hellyw.com/'+iGot_Key+'/Ctrip/'+msg)  
              ===>>>   requests.get('https://api.day.app/'+Brak_Key+'/Ctrip/'+msg)
              
并将 ######### 替换为 IOS上的《Bark》app属于自己的Bark_key  
```

替换完后点击**保存**。。。。。。。。。。。

## 定时触发
进入创建好的函数，触发方式，添加并选择适合自己的触发方式  

例如：  
名称：`自行决定`  
触发周期：`自定义触发周期`  
Cron表达式：`0 0 9 * * * *`（每天九点执行）
