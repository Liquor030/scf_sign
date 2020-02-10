# coding: utf-8
import sys
reload(sys)
sys.setdefaultencoding('utf8')
import json
import requests
import urllib
def start():
  sign_headers = {
     'Host': 'cccat.io',
     'Cookie': '*********'
  }
  sign = requests.get('https://cccat.io/user/_checkin.php',headers=sign_headers).text
  if '\"msg\"' in sign:
    s = json.loads(sign)
    msg = urllib.quote(str(s["msg"]))
    print 'Sign Success'
    requests.get('https://api.day.app/#########/CCCAT/'+msg)
    requests.get('https://push.hellyw.com/@@@@@@@@@/CCCAT/'+msg)
  else:
    print 'Sign error,Cookie Invalid'
    requests.get('https://sc.ftqq.com/$$$$$$$$$.send?text=CCCAT_%E7%AD%BE%E5%88%B0%E5%A4%B1%E8%B4%A5&desp=Cookie%E5%B7%B2%E5%A4%B1%E6%95%88')
def main_handler(event, context):
  return start()
if __name__ == '__main__':
  start()