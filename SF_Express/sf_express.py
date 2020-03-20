# coding: utf-8
import requests
import time
import json
import sys
reload(sys)
sys.setdefaultencoding('utf8')


def start():
    SCKEY = '$$$$$$$$$'
    iGot_Key = '#########'
    login_url = '*********'
    login = requests.get(login_url, allow_redirects=False)
    cookie = requests.utils.dict_from_cookiejar(login.cookies)
    sign_headers = {
        'Host': 'sf-integral-sign-in.weixinjia.net',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'SESSION=' + cookie['SESSION']
    }
    sign_data = time.strftime("date=%Y-%m-%d", time.localtime())
    sign_in = requests.post(
        'https://sf-integral-sign-in.weixinjia.net/app/signin',
        data=sign_data,
        headers=sign_headers).text
    if '\"isLogin\":false' in sign_in:
        print 'Sign error,Cookie Invalid'
        requests.get('https://sc.ftqq.com/'+SCKEY+'.send?text=SF%20Express_Cookie%e5%b7%b2%e5%a4%b1%e6%95%88')
    else:
        sign_json = json.loads(sign_in)
        if sign_json['msg'] == 'success' or sign_json['msg'] == 'ALREADY_CHECK':
            print 'Sign Success'
            requests.get(
                'https://push.hellyw.com/'+iGot_Key+'/SF%20Express/'+sign_json['msg'])
        else:
            print 'Sign error'
            requests.get(
                'https://sc.ftqq.com/'+SCKEY+'.send?text=SF%20Express_'+sign_json['msg'])


def main_handler(event, context):
    return start()


if __name__ == '__main__':
    start()
