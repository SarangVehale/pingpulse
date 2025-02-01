import speedtest 
import argparse
import json
import csv
import os
import time
import matplotlib.pyplot as plt
from datetime import datetime

# Constants
RESULTS_FILE_JSON = 'speed_test_results.json'
RESULTS_FILE_CSV = 'speed_test_results.csv'

def measure_internet_speed():
    try:
        st = speedtest.Speedtest()
        server = st.get_best_server()
        
        print(f"Testing against server: {server['sponsor']} located in {server['name']}, {server['country']}")
        
        download_speed = st.download() / 1_000_000  # Convert to Mbps
        upload_speed = st.upload() / 1_000_000  # Convert to Mbps
        ping_result = st.results.ping

        print(f"Download Speed: {download_speed:.2f} Mbps")
        print(f"Upload Speed: {upload_speed:.2f} Mbps")
        print(f"Ping: {ping_result:.2f} ms")

        return {
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'server': server,
            'download_speed': download_speed,
            'upload_speed': upload_speed,
            'ping': ping_result
        }
    except Exception as e:
        print(f"Error during speed test: {e}")
        return None

def save_results(result):
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
            writer.writerow(['Timestamp', 'Server Sponsor', 'Server Location', 'Download Speed (Mbps)', 'Upload Speed (Mbps)', 'Ping (ms)'])
        writer.writerow([
            result['timestamp'],
            result['server']['sponsor'],
            f"{result['server']['name']}, {result['server']['country']}",
            result['download_speed'],
            result['upload_speed'],
            result['ping']
        ])

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

def run_tests(runs, interval):
    for i in range(runs):
        print(f"\nRun {i+1} of {runs}")
        result = measure_internet_speed()
        if result:
            save_results(result)
        if i < runs - 1:
            time.sleep(interval)

def main():
    parser = argparse.ArgumentParser(description='Internet Speed Test CLI Tool')
    parser.add_argument('-r', '--runs', type=int, default=1, help='Number of times to run the speed test')
    parser.add_argument('-i', '--interval', type=int, default=60, help='Interval between tests in seconds')
    parser.add_argument('-p', '--plot', action='store_true', help='Plot historical speed test results')
    parser.add_argument('-s', '--schedule', action='store_true', help='Run tests at regular intervals indefinitely')
    args = parser.parse_args()

    if args.plot:
        plot_results()
    else:
        if args.schedule:
            print("Starting scheduled internet speed tests...")
            while True:
                result = measure_internet_speed()
                if result:
                    save_results(result)
                time.sleep(args.interval)
        else:
            run_tests(args.runs, args.interval)

if __name__ == "__main__":
    main()

