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
    print("Connected to WebView!")
    
    # 1. Fill the form inputs and trigger submit event programmatically
    print("Scheduling a demo task: 'Antigravity Test Task'...")
    js_create = """
    (async () => {
        // Open modal
        document.getElementById('btn-add-task-trigger').click();
        await new Promise(r => setTimeout(r, 100));
        
        // Fill fields
        document.getElementById('task-title').value = 'Antigravity Test Task';
        document.getElementById('task-date').value = '2026-05-24';
        document.getElementById('task-time').value = '23:30';
        document.getElementById('task-priority').value = 'high';
        document.getElementById('task-notes').value = 'Automated test task created by Antigravity AI';
        
        // Submit form
        const form = document.getElementById('form-task');
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    })();
    """
    
    tw.evaluate_js(sock, js_create, 1)
    
    print("Waiting 3 seconds for Google Calendar sync API response...")
    time.sleep(3)
    
    # 2. Dump terminal logs to see what happened
    js_logs = 'Array.from(document.querySelectorAll("#terminal-body .terminal-line")).map(p => p.textContent).join("\\n")'
    res = tw.evaluate_js(sock, js_logs, 2)
    if 'result' in res and 'value' in res['result']:
        print("\n--- UPDATE APP TERMINAL LOGS ---")
        print(res['result']['value'])
        
    sock.close()

if __name__ == "__main__":
    main()
