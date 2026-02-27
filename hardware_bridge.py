import serial
import requests
import json
import time

# --- CONFIGURATION ---
# ⚠️ ACTION REQUIRED: Check your Arduino IDE or Device Manager for the correct COM Port
PORT = 'COM3'  # Example: 'COM3' on Windows or '/dev/ttyUSB0' on Linux
BAUD_RATE = 115200
WEB_URL = 'http://localhost:3000/api/sensor'

print("\n" + "="*50)
print("   MANA POLAM - OFFLINE HARDWARE BRIDGE")
print("="*50)

def connect_serial():
    try:
        ser = serial.Serial(PORT, BAUD_RATE, timeout=0.1)
        print(f"✅ Successfully connected to {PORT}")
        return ser
    except Exception as e:
        print(f"❌ Error: Could not open {PORT}. retrying in 2 seconds...")
        print("   (Check if ESP32 is plugged in and you closed Serial Monitor in Arduino IDE)")
        time.sleep(2)
        return None

ser = None
while ser is None:
    ser = connect_serial()

print(f"📡 Forwarding data to: {WEB_URL}")
print("Watching for Serial data (Press Ctrl+C to stop)...\n")

while True:
    try:
        if ser.in_waiting > 0:
            # 1. Read line from ESP32 via USB
            line = ser.readline().decode('utf-8').strip()
            
            if not line:
                continue

            # 2. Try to parse JSON from hardware
            try:
                # Valid lines look like: {"zoneId":"A1", "soilMoisture":45, ...}
                if line.startswith('{'):
                    print(f"📥 USB -> SERVER: {line}")
                    
                    # 3. POST to Dashboard
                    r = requests.post(WEB_URL, json=json.loads(line))
                    
                    if r.status_code == 200:
                        # 4. Check for commands in response
                        response_data = r.json()
                        command = response_data.get('command')
                        
                        if command:
                            print(f"🚀 SERVER -> USB: Sending [{command.upper()}] to ESP32")
                            # Send command back down the wire
                            ser.write((command + '\n').encode('utf-8'))
                    else:
                        print(f"⚠️ Server Error: {r.status_code}")
                else:
                    # Just print non-JSON debug strings from ESP32
                    print(f"💬 HW Debug: {line}")

            except json.JSONDecodeError:
                if line: print(f"💬 Serial: {line}")

    except serial.SerialException:
        print(f"\n❌ Connection lost to {PORT}. Reconnecting...")
        ser = None
        while ser is None:
            ser = connect_serial()
    except KeyboardInterrupt:
        print("\n👋 Bridge stopped by user.")
        break
    except Exception as e:
        print(f"⚠️ Error: {str(e)}")
        time.sleep(0.1)

if ser:
    ser.close()
