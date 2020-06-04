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


def start():
    bomb_headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'cookie': 'pt_key=*********; pt_pin=#########;',
        'User-Agent': 'jdapp;'
    }
    bomb_body = 'functionId=cakebaker_pk_getCakeBomb&body={}&client=wh5&clientVersion=1.0.0'
    d_time = datetime.datetime.strptime(datetime.datetime.now().strftime("%Y-%m-%d%H")+':59:58', '%Y-%m-%d%H:%M:%S')
    d_time1 = d_time+datetime.timedelta(seconds=4)
    if datetime.datetime.now().minute == 59:
        while datetime.datetime.now() < d_time:
            time.sleep(1)
            logging.warning(datetime.datetime.now())

        while datetime.datetime.now() > d_time and datetime.datetime.now() < d_time1:
            bomb = requests.post('https://api.m.jd.com/client.action?functionId=cakebaker_pk_getCakeBomb', data=bomb_body, headers=bomb_headers).text
            logging.warning(datetime.datetime.now())
            logging.warning('京东炸弹:'+bomb)
            if '成功' in bomb:
                s = json.loads(bomb)
                msg = urllib.quote(str(s["data"]["result"]["tip"]))
                groupLevel = urllib.quote(str(s["data"]["result"]["groupLevel"]))
                opponentLevel = urllib.quote(str(s["data"]["result"]["opponentLevel"]))
                requests.get('https://api.day.app/@@@@@@@@@/JD_Bomb/'+msg+'%0a%e6%88%98%e5%86%b5%ef%bc%9a'+groupLevel+'+VS+'+opponentLevel)
                logging.warning('成功')
                break
    else:
        logging.warning(datetime.datetime.now())
        logging.warning('非活动时间！')

def main_handler(event, context):
    return start()


if __name__ == '__main__':
    start()
