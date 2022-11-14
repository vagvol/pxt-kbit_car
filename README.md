
# Apprentice Car blocks for micro:bit

The product page for the Apprentice Car can be found at [https://resoluteshop.co.za/product/apprentice-car/](https://resoluteshop.co.za/product/apprentice-car/)

# Blocks usage:

* Moving the car.  
The movement of the car is handled using the 'run' block which can make the car move forwards, backwards, left and right.   
And the car can then be stopped with the car stop block

```blocks
kBit.run(KBitDir.RunForward, 50)
basic.pause(500)
kBit.run(KBitDir.RunBackward, 50)
basic.pause(500)
kBit.run(KBitDir.TurnRight, 50)
basic.pause(500)
kBit.run(KBitDir.TurnLeft, 50)
basic.pause(500)
kBit.carStop()
```

* Moving the motors.  
If you wish to control individual motors, this can be done by using the motor blocks.   
this is done by choosing which motor you wish to control, the direction and power.

```blocks
kBit.motor(KBitMotorObs.LeftSide, KBitMotorDir.Forward, 50)
kBit.motor(KBitMotorObs.RightSide, KBitMotorDir.Forward, 50)
```

* IR.  
The IR remote can be used using the irRemote blocks,
and comparing which button was pressed with the stored list of buttons in the corresponding block.

```blocks
irRemote.connectInfrared(DigitalPin.P0)
basic.forever(function () {
    if (irRemote.returnIrButton() == irRemote.irButton(KBitIrButtons.Ok)) {
        basic.showString("OK")
        basic.pause(100)
        basic.clearScreen()
    }
})
```

* Neopixel ring.  
The neopixel ring should be inserted into pin 5, and can show basic colors as follows:

```blocks
let strip = neopixel.create(DigitalPin.P5, 18, NeoPixelMode.RGB)
basic.forever(function () {
    strip.showColor(neopixel.colors(NeoPixelColors.Yellow))
})
```

* Ultrasonic sensor.  
The Ultrasonic block will return the distance it measures in cm, and this can be compared as follows:
```blocks
if (kBit.ultra() > 5) {
        basic.showIcon(IconNames.Angry)
    } else {
        basic.showIcon(IconNames.Happy)
}
```

* LED blocks.  
In order to change the color of the two LED's at the front of the apprentice robot,
it is required you set the LED brightness and then the color, as shown below:

```blocks
kBit.ledBrightness(100)
kBit.led(KBitColor.Red)
```

## License
MIT

## Supported targets
* for PXT/microbit

## Further resources
More info can be found [here](https://resolute.education/curriculum/5/overview/)

```package
apprentice_car=github:resolute-support/pxt-apprentice_Car
```
