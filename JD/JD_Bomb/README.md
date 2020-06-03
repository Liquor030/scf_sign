# JD Bomb
> 仅供测试使用

## 创建空白函数

在[腾讯云函数](https://console.cloud.tencent.com/scf/index/1)中，新建**py2.7**的**空白函数**，创建完毕后 函数配置-超时时间-**40秒**

## 函数代码
复制jd_bomb.py中的内容，填入函数代码。

#### cookie
##### 获取
1.打开 https://home.m.jd.com/myJd/newhome.action 并登陆需要签到的账号

2.[教程](http://www.cnplugins.com/tool/check-cookie.html) 

3.找到 jd.com 下的 **pt_key** 和 **pt_pin** 

##### 替换
```
********* 与 ######### 分别替换为 jd的cookie中的pt_key与pt_pin
例如: 'cookie': 'pt_key=*********; pt_pin=#########;'   ====>>>  'Cookie': 'pt_key=AAJDFGWADD1fFR34JNJFKSNC MNCMVh6kO1m9dI7bAyWb0VrxA_EV-4q6adnkvdozWmlKC_JSFNS9Ea; pt_pin=jd_shdkfvdkv;' 
```

#### 以下功能不需要可以自行注释掉  
```
推送抢炸弹结果:  
@@@@@@@@@ 替换为 IOS上的《Bark》app属于自己的Bark_key 
```

替换完后点击**保存**。。。。。。。。。。。

## 定时触发
进入创建好的函数，触发方式，添加以下四个触发方式  

例如：  
名称：`自行决定`  
触发周期：`自定义触发周期`  
Cron表达式：`30 59 9 * * * *`（10点场）

Cron表达式：`30 59 11 * * * *`（12点场）

Cron表达式：`30 59 17 * * * *`（18点场）

Cron表达式：`30 59 19 * * * *`（20点场）
