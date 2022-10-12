
# Apprentice Car blocks for micro:bit

The product page for the Apprentice Car can be found at [https://resoluteshop.co.za/product/apprentice-car/](https://resoluteshop.co.za/product/apprentice-car/)

# Blocks usage:

* Movement
```blocks
K_Bit.run(DIR.RunForward, 0)
basic.pause(500)
K_Bit.carStop()
basic.pause(500)
K_Bit.Motor(MotorObs.LeftSide, MotorDir.Forward)
basic.pause(500)
K_Bit.MotorSta(MotorObs.LeftSide)
```

* IR
```blocks
irRemote.connectInfrared(DigitalPin.P0)
basic.forever(function () {
    if (irRemote.returnIrButton() == irRemote.irButton(IrButton.Ok)) {
        basic.showString("OK")
        basic.pause(100)
        basic.clearScreen()
    }
})
```

* Neopixel ring
```blocks
let strip = neopixel.create(DigitalPin.P5, 18, NeoPixelMode.RGB)
basic.forever(function () {
    strip.showColor(neopixel.colors(NeoPixelColors.Yellow))
})
```

* Ultrasonic sensor
```blocks
if (K_Bit.ultra() > 5) {
        basic.showIcon(IconNames.Angry)
    } else {
        basic.showIcon(IconNames.Happy)
}
```

* LED blocks (The brightness block is required)
```blocks
K_Bit.LED_brightness(0)
K_Bit.Led(COLOR.red)
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
