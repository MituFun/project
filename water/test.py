import requests

url = 'http://localhost:2333'

while True:
    level = input()
    response = requests.get(url + '/api/update?level=' + level)
    print(response.text)
