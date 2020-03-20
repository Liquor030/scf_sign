# coding: utf-8
import sys
reload(sys)
sys.setdefaultencoding('utf8')
import json
import requests
import urllib
def start():
  login_headers = {
    'Host': 'm.ctrip.com'
  }
  SCKEY = '$$$$$$$$$'
  iGot_Key = '#########'
  sign_data = '*********'
  sign_in = requests.post('https://m.ctrip.com/restapi/soa2/16575/signin',data=sign_data,headers=login_headers).text
  sign_json = json.loads(sign_in)
  if 'Failure' in sign_in:
    print 'Sign error,Cookie Invalid'
    requests.get('https://sc.ftqq.com/'+SCKEY+'.send?text=Ctrip_Cookie%E5%B7%B2%E5%A4%B1%E6%95%88')
  elif sign_json["errcode"] == 0 or sign_json["errcode"] == 3:
    print 'Sign Success'
    msg = str(sign_json["errmsg"])
    requests.get('https://push.hellyw.com/'+iGot_Key+'/Ctrip/'+msg)
  else:
    print 'Sign error,Cookie Invalid'
    msg = urllib.quote(str(sign_json["errmsg"]))
    requests.get('https://sc.ftqq.com/'+SCKEY+'.send?text=Ctrip_'+msg)
def main_handler(event, context):
  return start()
if __name__ == '__main__':
  start()
