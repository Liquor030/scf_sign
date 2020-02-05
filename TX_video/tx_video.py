# coding: utf-8
import sys
reload(sys)
sys.setdefaultencoding('utf8')
import requests
def start():
  login_headers = {
    'Referer': 'https://v.qq.com',
    'Cookie': '此处填入cookie'
  }
  login = requests.get('https://access.video.qq.com/user/auth_refresh?xxxxxxxx',headers=login_headers)
  cookie = requests.utils.dict_from_cookiejar(login.cookies)
  sign_headers = {
    'Cookie': '此处填入cookie记得去除掉vqq_vusession'+'; vqq_vusession='+cookie['vqq_vusession']+';'
  }
  sign = requests.get('https://vip.video.qq.com/fcgi-bin/comm_cgi?name=hierarchical_task_system&cmd=2',headers=sign_headers).text
  if 'Account Verify Error' in sign:
    print 'Sign error,Cookie Invalid'
    requests.get('https://sc.ftqq.com/xxxxxxxxxx.send?text=TX_%E7%AD%BE%E5%88%B0%E5%A4%B1%E8%B4%A5&desp=Cookie%E5%B7%B2%E5%A4%B1%E6%95%88')
  else:
    print 'Sign Success'
def main_handler(event, context):
  return start()
if __name__ == '__main__':
  start()
