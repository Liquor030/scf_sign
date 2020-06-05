# coding: utf-8
import requests
import time
import datetime
import sys
import logging
import urllib
import json
reload(sys)
sys.setdefaultencoding('utf8')

class Account(object):
    # 初始化中给对象属性赋值
    def __init__(self,pt_key , pt_pin):
        self.pt_key = pt_key
        self.pt_pin = pt_pin

def start():
    accounts = [
        Account('pt_key','pt_pin')
    ]
    Bark_key = '@@@@@@@@@'
    bomb_headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'cookie': 'pt_key=' + accounts[0].pt_key + '; pt_pin=' + accounts[0].pt_pin + ';',
        'User-Agent': 'jdapp;'
    }
    bomb_body = 'functionId=cakebaker_pk_getCakeBomb&body={}&client=wh5&clientVersion=1.0.0'
    bomb_state = requests.post('https://api.m.jd.com/client.action?functionId=cakebaker_pk_getCakeBomb', data=bomb_body, headers=bomb_headers).text
    logging.warning('炸弹状态:'+bomb_state)
    if 'timeStart' in bomb_state:
        bomb_state_json = json.loads(bomb_state)
        d_time = datetime.datetime.strptime(datetime.datetime.now().strftime("%Y-%m-%d")+bomb_state_json["data"]["result"]["timeStart"], '%Y-%m-%d%H:%M')+datetime.timedelta(hours=-8)
        logging.warning('距离开始时间还有: '+str((d_time-datetime.datetime.now()).seconds)+'秒')
        if  (d_time-datetime.datetime.now()).seconds <= 60:
            while datetime.datetime.now() < d_time+datetime.timedelta(seconds=-2):
                logging.warning(datetime.datetime.now()+datetime.timedelta(hours=8))
                time.sleep(1)
            while datetime.datetime.now() > d_time+datetime.timedelta(seconds=-2) and datetime.datetime.now() < d_time+datetime.timedelta(seconds=2):
                for account in accounts:
                    bomb_headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'cookie': 'pt_key=' + account.pt_key + '; pt_pin=' + account.pt_pin + ';',
                        'User-Agent': 'jdapp;'
                    }
                    bomb = requests.post('https://api.m.jd.com/client.action?functionId=cakebaker_pk_getCakeBomb', data=bomb_body, headers=bomb_headers).text
                    logging.warning(datetime.datetime.now()+datetime.timedelta(hours=8))
                    logging.warning('京东炸弹:'+bomb + ':'+ account.pt_pin)
                    if '成功' in bomb:
                        s = json.loads(bomb)
                        msg = urllib.quote(str(s["data"]["result"]["tip"]))
                        groupLevel = urllib.quote(str(s["data"]["result"]["groupLevel"]))
                        opponentLevel = urllib.quote(str(s["data"]["result"]["opponentLevel"]))
                        requests.get('https://api.day.app/'+Bark_key+'/JD_Bomb/'+msg+'%0a%e6%88%98%e5%86%b5%ef%bc%9a'+groupLevel+'+VS+'+opponentLevel)
                        logging.warning('成功' + ':'+ account.pt_pin)
        else:
            logging.warning(datetime.datetime.now()+datetime.timedelta(hours=8))
            logging.warning('非活动时间！')
    elif '登陆失败' in bomb_state:
        requests.get('https://api.day.app/'+Bark_key+'/JD_Bomb/%e7%99%bb%e9%99%86%e5%a4%b1%e8%b4%a5%ef%bc%8cCookie%e5%b7%b2%e5%a4%b1%e6%95%88%ef%bc%81')
        logging.warning('Cookie已失效！')
    else:
        logging.warning(datetime.datetime.now()+datetime.timedelta(hours=8))
        logging.warning('非活动时间！')

def main_handler(event, context):
    return start()


if __name__ == '__main__':
    start()
