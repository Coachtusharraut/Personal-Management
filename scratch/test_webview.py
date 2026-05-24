import socket
import urllib.request
import json
import urllib.parse
import hashlib
import base64
import os
import struct
import random

# A clean, dependency-free Python script to communicate with Android WebView over raw WebSockets
# using Chrome DevTools Protocol. It performs a WebSocket handshake, sends a masked text frame to
# evaluate JavaScript inside the app, and prints the results to verify calendar events.

def websocket_handshake(ws_url):
    parsed = urllib.parse.urlparse(ws_url)
    host = parsed.hostname
    port = parsed.port or 80
    path = parsed.path + ("?" + parsed.query if parsed.query else "")
    
    # 1. Connect via raw TCP
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect((host, port))
    
    # 2. Build WebSocket Handshake request
    key = base64.b64encode(bytes(random.getrandbits(8) for _ in range(16))).decode('utf-8')
    handshake = (
        f"GET {path} HTTP/1.1\r\n"
        f"Host: {host}:{port}\r\n"
        "Upgrade: websocket\r\n"
        "Connection: Upgrade\r\n"
        f"Sec-WebSocket-Key: {key}\r\n"
        "Sec-WebSocket-Version: 13\r\n\r\n"
    )
    sock.sendall(handshake.encode('utf-8'))
    
    # 3. Read handshake response
    resp = b""
    while b"\r\n\r\n" not in resp:
        resp += sock.recv(1024)
        
    if b"101" not in resp:
        raise RuntimeError("WebSocket handshake failed: " + resp.decode('utf-8'))
    return sock

def send_ws_frame(sock, text):
    payload = text.encode('utf-8')
    payload_len = len(payload)
    
    # WebSocket frame header construction
    header = bytearray()
    header.append(0x81) # FIN + Text frame opcode (129)
    
    # Mask bit (0x80) must be set for client-to-server frames
    if payload_len < 126:
        header.append(0x80 | payload_len)
    elif payload_len < 65536:
        header.append(0x80 | 126)
        header.extend(struct.pack("!H", payload_len))
    else:
        header.append(0x80 | 127)
        header.extend(struct.pack("!Q", payload_len))
        
    # Masking key (4 random bytes)
    mask_key = bytes(random.getrandbits(8) for _ in range(4))
    header.extend(mask_key)
    
    # Mask payload
    masked_payload = bytearray(payload_len)
    for i in range(payload_len):
        masked_payload[i] = payload[i] ^ mask_key[i % 4]
        
    sock.sendall(header + masked_payload)

def recv_ws_frame(sock):
    # Read first 2 bytes
    header = sock.recv(2)
    if len(header) < 2:
        return None
    
    opcode = header[0] & 0x0F
    payload_len = header[1] & 0x7F
    
    if payload_len == 126:
        payload_len = struct.unpack("!H", sock.recv(2))[0]
    elif payload_len == 127:
        payload_len = struct.unpack("!Q", sock.recv(8))[0]
        
    # Read payload
    payload = b""
    while len(payload) < payload_len:
        payload += sock.recv(payload_len - len(payload))
        
    return payload.decode('utf-8')

def evaluate_js(sock, js_code, msg_id=1):
    req = {
        "id": msg_id,
        "method": "Runtime.evaluate",
        "params": {
            "expression": js_code,
            "awaitPromise": True,
            "returnByValue": True
        }
    }
    send_ws_frame(sock, json.dumps(req))
    
    # Read frames until we get the response with matching ID
    while True:
        frame_text = recv_ws_frame(sock)
        if not frame_text:
            return None
        try:
            resp = json.loads(frame_text)
            if resp.get("id") == msg_id:
                return resp.get("result", {})
        except Exception:
            continue

def main():
    # 1. Fetch WebSocket Debug URL
    print("Fetching active WebView pages...")
    try:
        with urllib.request.urlopen('http://127.0.0.1:9222/json') as response:
            pages = json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print("Error connecting to DevTools socket. Make sure 'adb forward' is active.")
        print(e)
        return
        
    if not pages:
        print("No active pages found!")
        return
        
    page = pages[0]
    ws_url = page["webSocketDebuggerUrl"]
    print(f"Connecting to: {page['title']} ({ws_url})")
    
    sock = websocket_handshake(ws_url)
    print("WebSocket handshake successful! Evaluating app state...\n")
    
    # Query 1: Get all tasks in local IndexedDB
    get_tasks_js = "window.dbInstance.getAllTasks().then(tasks => JSON.stringify(tasks))"
    res = evaluate_js(sock, get_tasks_js, 1)
    tasks_json = res.get("result", {}).get("value")
    tasks = json.loads(tasks_json) if tasks_json else []
    print(f"--- IndexedDB Tasks List (Total: {len(tasks)}) ---")
    for t in tasks:
        print(f"ID: {t['id']} | Title: {t['title']} | Date: {t['date']} | Time: {t['time']} | Completed: {t['completed']}")
    
    # Query 2: Get calendar grid cells that have the event dot class
    print("\n--- Checking Calendar DOM State in WebView ---")
    has_event_js = "Array.from(document.querySelectorAll('.calendar-day.has-event')).map(el => el.textContent).join(', ')"
    res2 = evaluate_js(sock, has_event_js, 2)
    has_event_days = res2.get("result", {}).get("value")
    print(f"Days displaying event dot on calendar grid: [{has_event_days or 'None'}]")
    
    # Query 3: Print current date and timezone information of WebView
    print("\n--- Timezone and Date Properties inside WebView ---")
    date_info_js = (
        "JSON.stringify({"
        "  'localTime': new Date().toString(),"
        "  'isoDate': new Date().toISOString(),"
        "  'utcOffsetMinutes': new Date().getTimezoneOffset(),"
        "  'todayStr': (function() {"
        "     function getLocalDateString(dateObj) {"
        "         const year = dateObj.getFullYear();"
        "         const month = String(dateObj.getMonth() + 1).padStart(2, '0');"
        "         const day = String(dateObj.getDate()).padStart(2, '0');"
        "         return `${year}-${month}-${day}`;"
        "     }"
        "     return getLocalDateString(new Date());"
        "  })()"
        "})"
    )
    res3 = evaluate_js(sock, date_info_js, 3)
    info = json.loads(res3.get("result", {}).get("value", "{}"))
    print(f"WebView Local Time: {info.get('localTime')}")
    print(f"WebView UTC Time:   {info.get('isoDate')}")
    print(f"Timezone Offset:    {info.get('utcOffsetMinutes')} minutes")
    print(f"Timezone-safe YYYY-MM-DD: {info.get('todayStr')}")
    
    sock.close()

if __name__ == "__main__":
    main()
