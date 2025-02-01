import speedtest
import argparse
import json
import csv
import os
import time
import sys
import pyfiglet
import matplotlib.pyplot as plt
from datetime import datetime
from colorama import Fore, Back, Style
from tqdm import tqdm
import threading
import requests  # For getting IP info

# Constants
RESULTS_FILE_JSON = 'speed_test_results.json'
RESULTS_FILE_CSV = 'speed_test_results.csv'

# Print ASCII Banner
def print_banner():
    banner = pyfiglet.figlet_format("pingpulse")
    print(Fore.CYAN + banner + Style.RESET_ALL)

# Show Speed Test Results with Colors
def print_speed_results(download_speed, upload_speed, ping_result, ip_info):
    if download_speed > 50:
        print(Fore.GREEN + f"Download Speed: {download_speed:.2f} Mbps" + Style.RESET_ALL)
    else:
        print(Fore.RED + f"Download Speed: {download_speed:.2f} Mbps" + Style.RESET_ALL)

    if upload_speed > 50:
        print(Fore.GREEN + f"Upload Speed: {upload_speed:.2f} Mbps" + Style.RESET_ALL)
    else:
        print(Fore.RED + f"Upload Speed: {upload_speed:.2f} Mbps" + Style.RESET_ALL)

    print(Fore.YELLOW + f"Ping: {ping_result:.2f} ms" + Style.RESET_ALL)
    
    # Print IP, Service Provider, and Location Information
    print(Fore.MAGENTA + f"IP Address: {ip_info.get('ip')}")
    print(Fore.MAGENTA + f"Location: {ip_info.get('city')}, {ip_info.get('region')}, {ip_info.get('country')}")
    print(Fore.MAGENTA + f"Service Provider: {ip_info.get('org')}" + Style.RESET_ALL)

# Loading Animation during Speed Test
def loading_animation():
    loading_message = "Running Speed Test"
    for i in range(4):
        sys.stdout.write(f"\r{loading_message}{'.' * i}")
        sys.stdout.flush()
        time.sleep(0.5)

# Measure Internet Speed with Optimizations
def measure_internet_speed():
    try:
        st = speedtest.Speedtest()
        server = st.get_best_server()

        print(f"Testing against server: {server['sponsor']} located in {server['name']}, {server['country']}")

        # Start download and upload simultaneously
        download_thread = threading.Thread(target=lambda: st.download())
        upload_thread = threading.Thread(target=lambda: st.upload())
        
        download_thread.start()
        upload_thread.start()

        download_thread.join()  # Wait for download to finish
        upload_thread.join()  # Wait for upload to finish

        download_speed = st.results.download / 1_000_000  # Convert to Mbps
        upload_speed = st.results.upload / 1_000_000  # Convert to Mbps
        ping_result = st.results.ping

        print(f"\nDownloading... {download_speed:.2f} Mbps")
        print(f"Uploading... {upload_speed:.2f} Mbps")
        print(f"Ping... {ping_result:.2f} ms")

        # Fetch IP info from ipinfo.io
        ip_info = get_ip_info()

        return {
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'server': server,
            'download_speed': download_speed,
            'upload_speed': upload_speed,
            'ping': ping_result,
            'ip_info': ip_info
        }
    except Exception as e:
        print(f"Error during speed test: {e}")
        return None

# Fetch IP, Provider, and Location Info
def get_ip_info():
    try:
        response = requests.get('https://ipinfo.io/json')
        ip_info = response.json()
        return ip_info
    except requests.RequestException as e:
        print(f"Error fetching IP info: {e}")
        return {}

# Save Results to JSON and CSV
def save_results(result, comment=None):
    if comment:
        result['comment'] = comment  # Add a comment if provided

    # Save to JSON
    if os.path.exists(RESULTS_FILE_JSON):
        with open(RESULTS_FILE_JSON, 'r') as file:
            data = json.load(file)
    else:
        data = []
    data.append(result)
    with open(RESULTS_FILE_JSON, 'w') as file:
        json.dump(data, file, indent=4)

    # Save to CSV
    file_exists = os.path.isfile(RESULTS_FILE_CSV)
    with open(RESULTS_FILE_CSV, mode='a', newline='') as file:
        writer = csv.writer(file)
        if not file_exists:
            writer.writerow(['Timestamp', 'Server Sponsor', 'Server Location', 'Download Speed (Mbps)', 'Upload Speed (Mbps)', 'Ping (ms)', 'IP Address', 'Location', 'Service Provider', 'Comment'])
        writer.writerow([
            result['timestamp'],
            result['server']['sponsor'],
            f"{result['server']['name']}, {result['server']['country']}",
            result['download_speed'],
            result['upload_speed'],
            result['ping'],
            result['ip_info'].get('ip', ''),
            f"{result['ip_info'].get('city', '')}, {result['ip_info'].get('region', '')}, {result['ip_info'].get('country', '')}",
            result['ip_info'].get('org', ''),
            result.get('comment', '')
        ])

# Plot Results
def plot_results():
    if not os.path.exists(RESULTS_FILE_JSON):
        print("No data available for plotting.")
        return

    with open(RESULTS_FILE_JSON, 'r') as file:
        data = json.load(file)

    timestamps = [entry['timestamp'] for entry in data]
    download_speeds = [entry['download_speed'] for entry in data]
    upload_speeds = [entry['upload_speed'] for entry in data]

    plt.figure(figsize=(10, 5))
    plt.plot(timestamps, download_speeds, label='Download Speed (Mbps)', marker='o')
    plt.plot(timestamps, upload_speeds, label='Upload Speed (Mbps)', marker='x')
    plt.xlabel('Time')
    plt.ylabel('Speed (Mbps)')
    plt.title('Internet Speed Over Time')
    plt.legend()
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()

# Run Tests with Interval and Count
def run_tests(runs, interval):
    for i in tqdm(range(runs), desc="Running Speed Tests", ncols=100, bar_format="{l_bar}{bar}| {n_fmt}/{total_fmt}"):
        result = measure_internet_speed()
        if result:
            print_speed_results(result['download_speed'], result['upload_speed'], result['ping'], result['ip_info'])
            save_results(result)
        if i < runs - 1:
            time.sleep(interval)

# Main Function
def main():
    print_banner()

    parser = argparse.ArgumentParser(description='Internet Speed Test CLI Tool')
    parser.add_argument('-r', '--runs', type=int, default=1, help='Number of times to run the speed test')
    parser.add_argument('-i', '--interval', type=int, default=60, help='Interval between tests in seconds')
    parser.add_argument('-p', '--plot', action='store_true', help='Plot historical speed test results')
    parser.add_argument('-s', '--schedule', action='store_true', help='Run tests at regular intervals indefinitely')
    parser.add_argument('-c', '--comment', type=str, help='Add a comment to the test results')
    args = parser.parse_args()

    if args.plot:
        plot_results()
    else:
        if args.schedule:
            print("Starting scheduled internet speed tests...")
            while True:
                result = measure_internet_speed()
                if result:
                    save_results(result, args.comment)
                time.sleep(args.interval)
        else:
            run_tests(args.runs, args.interval)

if __name__ == "__main__":
    main()

