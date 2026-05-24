import urllib.request
import json
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import scratch.test_webview as tw

def main():
    try:
        with urllib.request.urlopen('http://127.0.0.1:9222/json') as response:
            pages = json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print("Failed to query http://127.0.0.1:9222/json")
        return
        
    if not pages:
        print("No active pages found!")
        return
        
    page = pages[0]
    ws_url = page["webSocketDebuggerUrl"]
    
    sock = tw.websocket_handshake(ws_url)
    
    # Safely evaluate JS expression
    js = 'document.getElementById("terminal-body") ? document.getElementById("terminal-body").innerHTML : "NOT FOUND"'
    res = tw.evaluate_js(sock, js, 1)
    if 'result' in res and 'value' in res['result']:
        print("--- TERMINAL LOGS ---")
        print(res['result']['value'])
    else:
        print("Failed to read terminal logs:", res)
        
    sock.close()

if __name__ == "__main__":
    main()
