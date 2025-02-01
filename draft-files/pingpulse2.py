import speedtest

def measure_internet_speed():
    st = speedtest.Speedtest()
    st.get_best_server()

    print("Testing Download Speed...")
    download_speed = st.download() / 1_000_000  # Convert to Mbps
    print(f"Download Speed: {download_speed:.2f} Mbps")

    print("Testing Upload Speed...")
    upload_speed = st.upload() / 1_000_000  # Convert to Mbps
    print(f"Upload Speed: {upload_speed:.2f} Mbps")

    ping_result = st.results.ping
    print(f"Ping: {ping_result:.2f} ms")

if __name__ == "__main__":
    print("Starting Internet Speed Test...")
    measure_internet_speed()

