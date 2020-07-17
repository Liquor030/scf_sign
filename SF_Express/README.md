# SF_Express 签到
> 仅供测试使用

## 创建空白函数

在[腾讯云函数](https://console.cloud.tencent.com/scf/index/1)中，新建**py2.7**的**空白函数**，创建完毕后 函数配置-超时时间-10秒

## 签到函数
复制sf_express.py中的内容，填入函数代码。

#### cookie
##### 获取
1.开始抓包，抓包教程自行百度

2.顺丰APP登陆需要签到的账号

3.打开 顺丰APP-我的顺丰-去签到 界面

4.在抓包工具中找到请求`https://sf-integral-sign-in.weixinjia.net/app/index?xxxx`，并复制整个完整链接

##### 替换
```
********* 替换为 刚才复制的链接
例如: login_url = '*********'
          ====>>>  login_url = 'https://sf-integral-sign-in.weixinjia.net/app/index?memNo=xxx&mobile=xxx&memId=xxx&openId=null&channel=5'  
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

替换完后点击**保存**，并测试。

## 定时触发
进入创建好的函数，触发管理，添加并选择适合自己的触发方式  

例如：  
名称：`自行决定`  
触发周期：`自定义触发周期`  
Cron表达式：`0 0 9 * * * *`（每天九点执行）
