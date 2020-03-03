# coding: utf-8
import sys
reload(sys)
sys.setdefaultencoding('utf8')
import json
import time
import requests
import urllib
def start():
  login_headers = {
    'Host': 'h5.ele.me',
    'Cookie': '*********'
  }
  USERID = '&&&&&&&&&'
  SCKEY = '$$$$$$$$$'
  Brak_Key = '#########'
  prize_data = {"channel":"app","index":0,"longitude":116.31025,"latitude":39.99287}
  share_data = {"channel":"app"}
  
  sign_in = requests.post('https://h5.ele.me/restapi/member/v2/users/'+USERID+'/sign_in',headers=login_headers).text
  sign_json = json.loads(sign_in)
  if 'UNAUTHORIZED' in sign_in:
    print 'Sign error,Cookie Invalid'
    requests.get('https://sc.ftqq.com/'+SCKEY+'.send?text=ELE_Cookie%E5%B7%B2%E5%A4%B1%E6%95%88')
  else:
  
    prize1 = requests.post('https://h5.ele.me/restapi/member/v2/users/'+USERID+'/sign_in/daily/prize',data=prize_data,headers=login_headers).text
    if 'me.ele.contract.exception.ServiceException' in prize1:
      print 'Signed'
      requests.get('https://sc.ftqq.com/'+SCKEY+'.send?text=ELE_%e5%b7%b2%e7%ad%be%e5%88%b0')
    else:
      prize1_json = json.loads(prize1)
      name1 = urllib.quote(str(prize1_json[0]["prizes"][0]["name"]))
      sum1 = str(prize1_json[0]["prizes"][0]["sum_condition"])
      amount1 = str(prize1_json[0]["prizes"][0]["amount"])
  
      share = requests.post('https://h5.ele.me/restapi/member/v1/users/'+USERID+'/sign_in/wechat',data=share_data,headers=login_headers)
      print 'Share Success'

      time.sleep(2)

      prize2 = requests.post('https://h5.ele.me/restapi/member/v2/users/'+USERID+'/sign_in/daily/prize',data=prize_data,headers=login_headers).text
      
      if 'me.ele.contract.exception.ServiceException' in prize2:
        print 'Signed'
        requests.get('https://sc.ftqq.com/'+SCKEY+'.send?text=ELE_%e5%b7%b2%e7%ad%be%e5%88%b0')
      else:
        prize2_json = json.loads(prize2)
        name2 = urllib.quote(str(prize2_json[0]["prizes"][0]["name"]))
        sum2 = str(prize2_json[0]["prizes"][0]["sum_condition"])
        amount2 = str(prize2_json[0]["prizes"][0]["amount"])
        
        print 'Sign Success'
        requests.get('https://api.day.app/'+Brak_Key+'/ELE/'+name1+'('+sum1+'-'+amount1+')'+'%0A'+name2+'('+sum2+'-'+amount2+')')
def main_handler(event, context):
  return start()
if __name__ == '__main__':
  start()
