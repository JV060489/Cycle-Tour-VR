from flask import Flask, jsonify, request
from gpiozero import Button
from flask_cors import CORS
import time
import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn

app = Flask(__name__)
CORS(app)

i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c)
chan = AnalogIn(ads, ADS.P0)



# Pin setup
back_tyre = 27
middle_up = 17
middle_down = 22

# Setup sensors with gpiozero
back_tyre_sensor = Button(back_tyre, pull_up=False)
middle_up_sensor = Button(middle_up, pull_up=False)
middle_down_sensor = Button(middle_down, pull_up=False)

last_time = None
speed_level = 0
wheel_circumference = 1.75
current_time1 = None
current_time2 = None

# Callback functions
def sensor_callback1():
    global last_time, speed_level
    current_time = time.time()
    if last_time is not None:
        elapsed_time = current_time - last_time
        speed = wheel_circumference / elapsed_time
        speed_level = min(int(speed), 100)
    last_time = current_time

def sensor_callback2():
    global current_time1
    current_time1 = time.time()

def sensor_callback3():
    global current_time2
    current_time2 = time.time()

# Attach callbacks to sensor events
back_tyre_sensor.when_pressed = sensor_callback1
middle_down_sensor.when_pressed = sensor_callback2
middle_up_sensor.when_pressed = sensor_callback3

@app.route('/')
def index():
    return "Hello Maams"

@app.route('/speed', methods=['GET'])
def get_speed():
    if current_time1 and current_time2 and current_time1 > current_time2:
        return jsonify({'speed_level': -2.5})
    return jsonify({'speed_level': speed_level})

@app.route('/potentiometer', methods=['GET'])
def get_potentiometer_voltage():
    voltage = chan.voltage  
    return jsonify({'potentiometer_voltage': voltage})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081) 
