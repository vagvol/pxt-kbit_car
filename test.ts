// tests go here; this will not be compiled when this package is used as an extension.

function Test_Neopixel() {
    strip = neopixel.create(DigitalPin.P8, 18, NeoPixelMode.RGB)
    strip.clear()
    basic.pause(500)
    strip.showColor(neopixel.colors(NeoPixelColors.Red))
    strip.show()
    basic.pause(500)
    strip.showColor(neopixel.colors(NeoPixelColors.Orange))
    strip.show()
    basic.pause(500)
    strip.showColor(neopixel.colors(NeoPixelColors.Yellow))
    strip.show()
    basic.pause(500)
    strip.showColor(neopixel.colors(NeoPixelColors.Green))
    strip.show()
    basic.pause(500)
    strip.clear()
}

function Test_Movement() {
    kBit.run(DIR.RunForward, 40)
    basic.pause(1000)
    kBit.carStop()
    basic.pause(500)
    kBit.run(DIR.RunBack, 40)
    basic.pause(1000)
    kBit.carStop()
    basic.pause(500)
    kBit.run(DIR.TurnLeft, 40)
    basic.pause(1000)
    kBit.carStop()
    basic.pause(500)
    kBit.run(DIR.TurnRight, 40)
    basic.pause(1000)
    kBit.carStop()
    basic.pause(500)
    kBit.carStop()
}
let strip: neopixel.Strip = null
/**
 * Testing the neopixel should show red, orange, yellow, green and blue, for a second each
 */
Test_Neopixel()

/**
 * Testing the motors will make the robot move forwards, backwards, turn left and turn right
 */
Test_Movement()