import urllib.request
import urllib.error
import json

url = "http://localhost:8000/requests/"
data = {
    "student_id": "test_uid",
    "type": "OD",
    "start_date": "2026-04-22",
    "end_date": "2026-04-23",
    "days": 2,
    "reason": "i participate hackthon"
}

req = urllib.request.Request(
    url, 
    data=json.dumps(data).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

try:
    response = urllib.request.urlopen(req)
    print("SUCCESS")
    print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.code)
    print(e.read().decode('utf-8'))
except Exception as e:
    print("OTHER ERROR:", str(e))
