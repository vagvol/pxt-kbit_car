/**
 * used for RGB-LED
 */
enum COLOR {
    Red,
    Green,
    Blue,
    White,
    Black
}
/**
 * used for control motor
 */
enum DIR {
    RunForward = 0,
    RunBack = 1,
    TurnLeft = 2,
    TurnRight = 3
}
/**
 * used for IR remote
 */
const enum IRBUTTON {
    //% block=" "
    Any = -1,
    //% block="▲"
    Up = 70,
    //% block=" "
    Unused_2 = -2,
    //% block="◀"
    Left = 68,
    //% block="OK"
    Ok = 64,
    //% block="▶"
    Right = 67,
    //% block=" "
    Unused_3 = -3,
    //% block="▼"
    Down = 21,
    //% block=" "
    Unused_4 = -4,
    //% block="1"
    Number_1 = 22,
    //% block="2"
    Number_2 = 25,
    //% block="3"
    Number_3 = 13,
    //% block="4"
    Number_4 = 12,
    //% block="5"
    Number_5 = 24,
    //% block="6"
    Number_6 = 94,
    //% block="7"
    Number_7 = 8,
    //% block="8"
    Number_8 = 28,
    //% block="9"
    Number_9 = 90,
    //% block="*"
    Star = 66,
    //% block="0"
    Number_0 = 82,
    //% block="#"
    Hash = 74
}
/**
 * used for motor and infrared obstacle sensor
 */
enum MotorObs {
    LeftSide = 0,
    RightSide = 1
}
enum MotorDir {
    Forward = 0,
    Back = 1
}
//% color="#ff6800" icon="\uf1b9" weight=15
//% groups="['Motor', 'RGB-led', 'Neo-pixel', 'Sensor', 'Tone']"
namespace kBit {

    /**
     * used to control PCA9685
     */
    const PCA9685_ADDRESS = 0x43;   //device address; controlls motors
    const MODE1 = 0x00;
    const MODE2 = 0x01;
    const SUBADR1 = 0x02;
    const SUBADR2 = 0x03;
    const SUBADR3 = 0x04;
    const PRESCALE = 0xFE;
    const LED0_ON_L = 0x06;
    const LED0_ON_H = 0x07;
    const LED0_OFF_L = 0x08;
    const LED0_OFF_H = 0x09;
    const ALL_LED_ON_L = 0xFA;
    const ALL_LED_ON_H = 0xFB;
    const ALL_LED_OFF_L = 0xFC;
    const ALL_LED_OFF_H = 0xFD;

    let PCA9685_Initialized = false

    function i2cRead(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function i2cWrite(PCA9685_ADDRESS: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(PCA9685_ADDRESS, buf)
    }

    function setFreq(freq: number): void {
        // Constrain the frequency
        let prescaleval = 25000000;
        prescaleval /= 4096;
        prescaleval /= freq;
        prescaleval -= 1;
        let prescale = prescaleval; //Math.Floor(prescaleval + 0.5);
        let oldmode = i2cRead(PCA9685_ADDRESS, MODE1);
        let newmode = (oldmode & 0x7F) | 0x10; // sleep
        i2cWrite(PCA9685_ADDRESS, MODE1, newmode); // go to sleep
        i2cWrite(PCA9685_ADDRESS, PRESCALE, prescale); // set the prescaler
        i2cWrite(PCA9685_ADDRESS, MODE1, oldmode);
        control.waitMicros(5000);
        i2cWrite(PCA9685_ADDRESS, MODE1, oldmode | 0xa1);
    }

    function setPwm(channel: number, on: number, off: number): void {
        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on >> 8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(PCA9685_ADDRESS, buf);
    }

    function initPCA9685(): void {
        i2cWrite(PCA9685_ADDRESS, MODE1, 0x00);  //initialize the mode register 1
        setFreq(50);   //20ms
        for (let idx = 0; idx < 16; idx++) {
            setPwm(idx, 0, 0);
        }
        PCA9685_Initialized = true;
    }

    /////////////////////////////////////////////////////
    /**
     * move the car in a desired direction
     */
    //% block="car $direction speed: $speed \\%"
    //% speed.min=0 speed.max=100
    //% group="Motor" weight=99

    export function run(direction: DIR, speed: number) {
        if (!PCA9685_Initialized) {
            initPCA9685();
        }
        let speed_value = Math.map(speed, 0, 100, 0, 4095);
        switch (direction) {
            case 0:  //run forward
                setPwm(1, 0, speed_value);  //control speed : 0---4095
                setPwm(0, 0, 0);
                setPwm(3, 0, speed_value);  //control speed : 0---4095
                setPwm(2, 0, 0);
                break;
            case 1:  //run back
                setPwm(1, 0, speed_value);  //control speed : 0---4095
                setPwm(0, 0, 4095);
                setPwm(3, 0, speed_value);  //control speed : 0---4095
                setPwm(2, 0, 4095);
                break;
            case 2:  //turn left
                setPwm(1, 0, speed_value);  //control speed : 0---4095
                setPwm(0, 0, 4095);
                setPwm(3, 0, speed_value);  //control speed : 0---4095
                setPwm(2, 0, 0);
                break;
            case 3:  //turn right
                setPwm(1, 0, speed_value);  //control speed : 0---4095
                setPwm(0, 0, 0);
                setPwm(3, 0, speed_value);  //control speed : 0---4095
                setPwm(2, 0, 4095);
                break;
            default: break;
        }
    }
    /**
     * stop the car from moving
     */
    //% block="car stop"
    //% group="Motor" weight=98
    export function carStop() {
        if (!PCA9685_Initialized) {
            initPCA9685();
        }
        setPwm(1, 0, 0);  //control speed : 0---4095
        setPwm(3, 0, 0);  //control speed : 0---4095
    }
    /**
     * set speed of motors on the car
     */
    //% block="$M motor run $MD speed: $speed \\%"
    //% speed.min=0 speed.max=100
    //% group="Motor" weight=97
    export function motor(M: MotorObs, MD: MotorDir, speed: number) {
        if (!PCA9685_Initialized) {
            initPCA9685();
        }
        let speed_value = Math.map(speed, 0, 100, 0, 4095);
        if (M == 0 && MD == 0) {
            setPwm(1, 0, speed_value);  //control speed : 0---4095
            setPwm(0, 0, 0);
        }
        if (M == 0 && MD == 1) {
            setPwm(1, 0, speed_value);  //control speed : 0---4095
            setPwm(0, 0, 4095);
        }

        if (M == 1 && MD == 0) {
            setPwm(3, 0, speed_value);  //control speed : 0---4095
            setPwm(2, 0, 0);
        }
        if (M == 1 && MD == 1) {
            setPwm(3, 0, speed_value);  //control speed : 0---4095
            setPwm(2, 0, 4095);
        }

    }
    /**
     * control individual motors
     */
    //% block="$M motor stop"
    //% group="Motor" weight=96
    export function motorMove(M: MotorObs) {
        if (!PCA9685_Initialized) {
            initPCA9685();
        }

        if (M == 0) {         //left side motor
            setPwm(1, 0, 0);  //control speed : 0---4095
            setPwm(0, 0, 0);
        }
        if (M == 1) {         //right side motor
            setPwm(3, 0, 0);  //control speed : 0---4095
            setPwm(2, 0, 0);
        }
    }
    /////////////////////////////////////////////////////
    /**
     * set rgb-led brightness
     */
    let lBrightness = 4095;  //control the rgb-led brightness
    //% block="LED brightness $br"
    //% br.min=0 br.max=255
    //% group="RGB-led" weight=79
    export function ledBrightness(br: number) {
        if (!PCA9685_Initialized) {
            initPCA9685();
        }
        lBrightness = Math.map(br, 0, 255, 4095, 0);
    }
    /**
     * set the rgb-led color via the color card
     */
    //% block="set RGBled $col"
    //% group="RGB-led" weight=78
    export function led(col: COLOR) {
        if (!PCA9685_Initialized) {
            initPCA9685();
        }
        if (col == COLOR.Red) {
            setPwm(5, 0, 4095);
            setPwm(6, 0, lBrightness);
            setPwm(4, 0, 4095);
        }
        if (col == COLOR.Green) {
            setPwm(5, 0, lBrightness);
            setPwm(6, 0, 4095);
            setPwm(4, 0, 4095);
        }
        if (col == COLOR.Blue) {
            setPwm(5, 0, 4095);
            setPwm(6, 0, 4095);
            setPwm(4, 0, lBrightness);
        }
        if (col == COLOR.White) {
            setPwm(5, 0, lBrightness);
            setPwm(6, 0, lBrightness);
            setPwm(4, 0, lBrightness);
        }
        if (col == COLOR.Black) {
            setPwm(5, 0, 4095);
            setPwm(6, 0, 4095);
            setPwm(4, 0, 4095);
        }
    }
    /**
     * set the rgb-led color via data
     */
    //% block=" set RGBled R:$red G:$green B:$blue"
    //% red.min=0 red.max=255 green.min=0 green.max=255 blue.min=0 blue.max=255
    //% group="RGB-led" weight=77
    export function setLed(red: number, green: number, blue: number) {
        if (!PCA9685_Initialized) {
            initPCA9685();
        }

        let R = Math.map(red, 0, 255, 4095, lBrightness);
        let G = Math.map(green, 0, 255, 4095, lBrightness);
        let B = Math.map(blue, 0, 255, 4095, lBrightness);

        setPwm(6, 0, R);
        setPwm(5, 0, G);
        setPwm(4, 0, B);
    }
    /**
     * turn off all rgb-led
     */
    //% block="turn off RGB-led"
    //% group="RGB-led" weight=76
    export function offLed() {
        if (!PCA9685_Initialized) {
            initPCA9685();
        }

        setPwm(6, 0, 4095);
        setPwm(5, 0, 4095);
        setPwm(4, 0, 4095);
    }

    /////////////////////////////////////////////////////
    
    
    /**
     * infrared obstacle sensor
     */
    //% block="$LR obstacle sensor "
    //% group="Sensor" weight=69
    export function obstacle(LR: MotorObs): number {
        let val;
        if (LR == 0) {  //left side
            pins.setPull(DigitalPin.P2, PinPullMode.PullNone);  //leftside
            val = pins.digitalReadPin(DigitalPin.P2);
        }
        if (LR == 1) {  //right side
            pins.setPull(DigitalPin.P11, PinPullMode.PullNone); //rightside
            val = pins.digitalReadPin(DigitalPin.P11);
        }
        return val;
    }

    ////////////////////////////////////////////

    /**
     * individual infared line sensors
     */
    //% block="$LR line sensor "
    //% group="Sensor" weight=69
    export function lineSensor(LR: MotorObs): number {
        let val;
        if (LR == 1) {  //left side
            pins.setPull(DigitalPin.P12, PinPullMode.PullNone);
            val = pins.digitalReadPin(DigitalPin.P12);
        }
        if (LR == 0) {  //right side
            pins.setPull(DigitalPin.P13, PinPullMode.PullNone);
            val = pins.digitalReadPin(DigitalPin.P13);
        }
        return val;
        
    }

    
    /**
     * Line following direction block
     * return 0b01 or 0b10
     * 0b01 (P12) is the sensor on the left
     * 0b10 (P13) is the sensor on the right
     */
    //% block="line Tracking"
    //% group="Sensor" weight=68
    export function lineTracking(): number {
        pins.setPull(DigitalPin.P12, PinPullMode.PullNone);
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone);
        let val = pins.digitalReadPin(DigitalPin.P12) << 0 | pins.digitalReadPin(DigitalPin.P13) << 1;
        return val;
    }
    /**
     * Ultrasonic sensor
     */
    const TRIG_PIN = DigitalPin.P14;
    const ECHO_PIN = DigitalPin.P15;
    let lastTime = 0;
    /**
     * Ultrasonic Sensor to measure distance
     */
    //% block="ultrasonic"
    //% group="Sensor" weight=67
    export function ultra(): number {
        pins.setPull(TRIG_PIN, PinPullMode.PullNone);
        //send trig pulse
        pins.digitalWritePin(TRIG_PIN, 0)
        control.waitMicros(2);
        pins.digitalWritePin(TRIG_PIN, 1)
        control.waitMicros(10);
        pins.digitalWritePin(TRIG_PIN, 0)

        // read echo pulse  max distance : 6m(35000us)
        //2020-7-6 
        // pins.pulseIn():This function has a bug and returns data with large errors.
        let t = pins.pulseIn(ECHO_PIN, PulseValue.High, 35000);
        let ret = t;

        //Eliminate the occasional bad data
        if (ret == 0 && lastTime != 0) {
            ret = lastTime;
        }
        lastTime = t;
        //2020-7-6
        //It would normally divide by 58, because the pins.pulseIn() function has an error, so it's divided by 58
        return Math.round(ret / 40);
    }
    /**
     * photoresistance sensor to measure light
     */
    //% block="photoresistor "
    //% group="Sensor" weight=66
    export function PH(): number {
        return pins.analogReadPin(AnalogPin.P1);
    }

}

//% color="#ff6800" weight=10 icon="\uf1eb"
namespace irRemote {
    /**
     * define a IR receiver class
     */
    class irReceiver {
        constructor() {
            this.address = 0;
            this.command = 0;
        }
        address: number;
        command: number;
        IR_pin: DigitalPin;
    }
    //create a IR receiver class
    let IR_R = new irReceiver;

    //define nec_IR maximum number of pulses is 33.
    //create 2 pulse cache array.
    let maxPulse: number = 33;
    let low_pulse: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let high_pulse: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    //must define for 33,
    //otherwise there is a risk of error in receiving the first data.
    let LpulseCounter: number = 33;
    let HpulseCounter: number = 33;

    let LpulseTime: number = 0;
    let HpulseTime: number = 0;
    //let pulse9ms: boolean = false;
    //let pulse4ms: boolean = false;
    //This variable will become true when the pulse is repeated
    //let repeatedPulse: boolean = false;

    /**
     * initialize the IR receiver function
     */
    function irInit(IR_pin: DigitalPin) {
        pins.onPulsed(IR_pin, PulseValue.Low, () => {      //interrupt event
            LpulseTime = pins.pulseDuration();             //measure the pulse
            if (6750 < LpulseTime && LpulseTime < 11250) { //9ms
                LpulseCounter = 0;
            }
            if (LpulseCounter < maxPulse /*&& repeatedPulse == false*/) {
                low_pulse[LpulseCounter] = LpulseTime;
                LpulseCounter += 1;
            }
        });
        pins.onPulsed(IR_pin, PulseValue.High, () => {
            HpulseTime = pins.pulseDuration();
            /*if (1687 < HpulseTime && HpulseTime < 2812) {  //2.25ms
                repeatedPulse = true;
            }*/
            if (3375 < HpulseTime && HpulseTime < 5625) {    //4.5ms
                HpulseCounter = 0;
                //repeatedPulse = false;
            }
            if (HpulseCounter < maxPulse /*&& repeatedPulse == false*/) {
                high_pulse[HpulseCounter] = HpulseTime;
                HpulseCounter += 1;
            }
        });
    }
    /**
    * Convert the pulse into data function
    */
    function irDataProcessing() {
        let tempAddress: number = 0;
        let inverseAddress: number = 0;
        let tempCommand: number = 0;
        let inverseCommand: number = 0;
        let num: number;
        //confirm start pulse
        if (6750 < low_pulse[0] && low_pulse[0] < 11250 && HpulseCounter >= 33) {  //9ms
            //conver the pulse into data
            for (num = 1; num < maxPulse; num++) {
                //if (420 < low_pulse[num] && low_pulse[num] < 700) {      //0.56ms
                if (1267 < high_pulse[num] && high_pulse[num] < 2112) {    //1.69ms = 1, 0.56ms = 0
                    if (1 <= num && num < 9) {    //conver the pulse into address
                        tempAddress |= 1 << (num - 1);
                    }
                    if (9 <= num && num < 17) {   //conver the pulse into inverse address
                        inverseAddress |= 1 << (num - 9);
                    }
                    if (17 <= num && num < 25) {   //conver the pulse into command
                        tempCommand |= 1 << (num - 17);
                    }
                    if (25 <= num && num < 33) {   //conver the pulse into inverse command
                        inverseCommand |= 1 << (num - 25);
                    }
                }
                //}
            }
            low_pulse[0] = 0;
            //check the data and return the data to IR receiver class.
            if ((tempAddress + inverseAddress == 0xff) && (tempCommand + inverseCommand == 0xff)) {
                IR_R.address = tempAddress;
                IR_R.command = tempCommand;
                return;
            } else {  //Return -1 if check error.
                IR_R.address = -1;
                IR_R.command = -1;
                return;
            }
        }
        IR_R.address = 0;
        IR_R.command = 0;
    }
    /**
     * Connects to the IR receiver module at the specified pin.
     */
    //% blockId="infrared_connect"
    //% block="connect IR receiver at %IR_pin"
    //% IR_pin.fieldEditor="gridpicker"
    //% IR_pin.fieldOptions.columns=4
    //% IR_pin.fieldOptions.tooltips="false"
    //% weight=99
    export function connectInfrared(IR_pin: DigitalPin): void {
        IR_R.IR_pin = IR_pin;   //define IR receiver control pin
        pins.setPull(IR_R.IR_pin, PinPullMode.PullUp);
        irInit(IR_R.IR_pin);   //initialize the IR receiver
    }
    /**
     * Returns the command code of a specific IR button.
     */
    //% blockId=infrared_button
    //% button.fieldEditor="gridpicker"
    //% button.fieldOptions.columns=3
    //% button.fieldOptions.tooltips="false"
    //% block="IR button %button"
    //% weight=98
    export function irButton(button: IRBUTTON): number {
        return button as number;
    }
    /**
     * Returns the code of the IR button that is currently pressed and 0 if no button is pressed.
     * It is recommended to delay 110ms to read the data once
     */
    //% blockId=infrared_pressed_button
    //% block="IR button"
    //% weight=97
    export function returnIrButton(): number {
        irDataProcessing();
        basic.pause(80);      //Delay by one infrared receiving period
        return IR_R.command;
    }
}