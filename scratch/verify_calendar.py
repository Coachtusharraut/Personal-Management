import urllib.request
import json
import time
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import scratch.test_webview as tw

# This script simulates calendar navigation, checks the calendar day cells in the DOM,
# and verifies that both May 24 and May 25 correctly display their training event dots in real-time.

def main():
    print("Connecting to WebView remote debugging socket...")
    try:
        with urllib.request.urlopen('http://127.0.0.1:9222/json') as response:
            pages = json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print("Failed to query http://127.0.0.1:9222/json. Check adb forward status.")
        print(e)
        return
        
    if not pages:
        print("No active pages found inside app WebView!")
        return
        
    page = pages[0]
    ws_url = page["webSocketDebuggerUrl"]
    print(f"Target page resolved: {page['title']}")
    
    sock = tw.websocket_handshake(ws_url)
    print("WebSocket handshake successful! Initiating automated user simulation...")
    
    # 1. Simulate navigation clicks: switch view to Tasks and select Calendar Grid sub-tab
    print("Navigating to Tasks tab and switching segment control to 'Calendar Grid'...")
    navigation_js = (
        "document.getElementById('nav-tab-tasks').click();"
        "document.getElementById('segment-tasks-calendar').click();"
    )
    tw.evaluate_js(sock, navigation_js, 1)
    time.sleep(0.5) # Wait for DOM rendering and database query
    
    # 2. Verify grid cells count
    print("Verifying calendar grid DOM structure...")
    count_res = tw.evaluate_js(sock, "document.querySelectorAll('.calendar-day').length", 2)
    grid_cells_count = count_res.get("result", {}).get("value", 0)
    print(f"-> Total calendar days found in DOM: {grid_cells_count}")
    
    # 3. Fetch all cells details for validation
    details_js = (
        "Array.from(document.querySelectorAll('.calendar-day')).map(el => ({"
        "   dayNum: el.textContent,"
        "   monthClass: el.classList.contains('curr-month') ? 'curr' : (el.classList.contains('prev-month') ? 'prev' : 'next'),"
        "   hasEvent: el.classList.contains('has-event'),"
        "   isSelected: el.classList.contains('selected')"
        "}))"
    )
    res_details = tw.evaluate_js(sock, details_js, 3)
    cells = res_details.get("result", {}).get("value", [])
    
    # 4. Check for event dots on May 24 and May 25
    print("\nEvaluating events dots and selections on calendar grid:")
    may_24_valid = False
    may_25_valid = False
    
    for c in cells:
        day_num = c.get("dayNum")
        month = c.get("monthClass")
        has_event = c.get("hasEvent")
        is_selected = c.get("isSelected")
        
        if month == "curr":
            if day_num == "24":
                print(f"-> May 24 (Today): has-event={has_event}, selected={is_selected}")
                if has_event:
                    may_24_valid = True
            elif day_num == "25":
                print(f"-> May 25 (Tomorrow): has-event={has_event}, selected={is_selected}")
                if has_event:
                    may_25_valid = True
                    
    print("\n--- AUTOMATED TEST RESULTS VERIFICATION REPORT ---")
    print(f"1. Calendar Grid Cells Count  : {'[PASS] 42 cells correctly rendered' if grid_cells_count == 42 else '[FAIL] Found ' + str(grid_cells_count) + ' cells'}")
    print(f"2. May 24 Today Event Dot    : {'[PASS] Dot rendered successfully' if may_24_valid else '[FAIL] No event dot displayed'}")
    print(f"3. May 25 Tomorrow Event Dot : {'[PASS] Dot rendered successfully' if may_25_valid else '[FAIL] No event dot displayed'}")
    
    if grid_cells_count == 42 and may_24_valid and may_25_valid:
        print("\n[VERIFICATION SUCCESSFUL] The local calendar timezone matching and DOM rendering checks passed 100%!")
    else:
        print("\n[VERIFICATION FAILED] One or more calendar checks failed.")
        
    sock.close()

if __name__ == "__main__":
    main()
