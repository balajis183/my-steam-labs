import serial.tools.list_ports

def is_board_connected():
    ports = serial.tools.list_ports.comports()
    for port in ports:
        # Optional: Match by known manufacturer or description
        if "USB" in port.description or "UART" in port.description or "COM" in port.device:
            return True
    return False

if __name__ == "__main__":
    if is_board_connected():
        print("connected")
    else:
        print("disconnected")
