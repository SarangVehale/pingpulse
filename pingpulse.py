import socket
import time

def measure_download_speed(host="speedtest.tele2.net", port=80, duration=5):
    request = f"GET /10MB.zip HTTP/1.1\r\nHost: {host}\r\nConnection: close\r\n\r\n"
    total_data = 0

    try:
        with socket.create_connection((host, port)) as s:
            s.sendall(request.encode())
            start_time = time.time()
            while time.time() - start_time < duration:
                data = s.recv(4096)
                if not data:
                    break
                total_data += len(data)

        download_speed_mbps = (total_data * 8) / (duration * 1_000_000)
        print(f"Download Speed: {download_speed_mbps:.2f} Mbps")

    except Exception as e:
        print(f"Download test failed: {e}")

def measure_upload_speed(host="speedtest.tele2.net", port=80, duration=5):
    data_to_send = b"x" * 4096  # 4 KB of data
    total_data = 0

    try:
        with socket.create_connection((host, port)) as s:
            start_time = time.time()
            while time.time() - start_time < duration:
                s.sendall(data_to_send)
                total_data += len(data_to_send)

        upload_speed_mbps = (total_data * 8) / (duration * 1_000_000)
        print(f"Upload Speed: {upload_speed_mbps:.2f} Mbps")

    except Exception as e:
        print(f"Upload test failed: {e}")

if __name__ == "__main__":
    print("Starting Internet Speed Test...")
    measure_download_speed()
    measure_upload_speed()

