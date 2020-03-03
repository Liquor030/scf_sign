# ELE 签到
> 仅供测试使用

## 创建空白函数

在[腾讯云函数](https://console.cloud.tencent.com/scf/index/1)中，新建**py2.7**的**空白函数**，创建完毕后 函数配置-超时时间-**10秒**

## 签到函数
复制ele.py中的内容，填入函数代码，点击**保存**。

#### cookie
##### 获取
1.打开 https://h5.ele.me/profile/ 

2.[教程](http://www.cnplugins.com/tool/check-cookie.html) 

3.找到ele.me下的 **SID** 和 **USERID** 

##### 替换
```
********* 替换为 ele的cookie中的SID
例如: 'Cookie': '*********'   ====>>>  'Cookie': 'SID=idILJZ3dheH8snCM9yXaNaMr1MUXilkEx7uA27'

&&&&&&&&& 替换为 ele的cookie中的USERID
例如:  USERID = '&&&&&&&&&'   ====>>>   USERID = '6121880385'
```

#### 以下这些功能不需要可以自行注释掉  
```
1.推送签到结果  
######### 替换为 IOS上的《Bark》app属于自己的Bark_key

2.签到失败时通过微信通知  
$$$$$$$$$ 替换为 Server酱(http://sc.ftqq.com) 中属于自己的SCKEY  
```

## 定时触发
进入创建好的函数，触发方式，添加并选择适合自己的触发方式  

例如：  
名称：`自行决定`  
触发周期：`自定义触发周期`  
Cron表达式：`0 0 9 * * * *`（每天九点执行）
