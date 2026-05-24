import urllib.request
import json
import time
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
    
    # Dump terminal output
    print("--- APP TERMINAL DUMP ---")
    js = "Array.from(document.querySelectorAll('#terminal-output p')).map(p => p.textContent).join('\\n')"
    res = tw.evaluate_js(sock, js, 1)
    if 'result' in res and 'value' in res['result']:
        print(res['result']['value'])
        
    # Check localStorage for token
    print("\n--- LOCAL STORAGE DUMP ---")
    js = "JSON.stringify(localStorage)"
    res = tw.evaluate_js(sock, js, 2)
    if 'result' in res and 'value' in res['result']:
        print(res['result']['value'])
        
    sock.close()

if __name__ == "__main__":
    main()
