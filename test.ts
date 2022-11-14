// tests go here; this will not be compiled when this package is used as an extension.
kBit.carStop()
function testNeopixel() {
    strip.clear()
    basic.pause(500)
    strip.showColor(neopixel.colors(NeoPixelColors.White))
    strip.show()
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
    strip.showColor(neopixel.colors(NeoPixelColors.Blue))
    strip.show()
    basic.pause(500)
    strip.clear()
}

function followLine() {
    let tracking_values = kBit.lineTracking()
    if (tracking_values == 1) {
        kBit.run(KBitDir.TurnRight, 40)
    } else if (tracking_values == 2) {
        kBit.run(KBitDir.TurnLeft, 40)
    } else if (tracking_values == 3) {
        kBit.run(KBitDir.RunForward, 30)
    } else {
        basic.clearScreen()
    }
}

function testMovement() {
    kBit.run(KBitDir.RunForward, 40)
    basic.pause(1000)
    kBit.carStop()
    basic.pause(500)
    kBit.run(KBitDir.RunBack, 40)
    basic.pause(1000)
    kBit.carStop()
    basic.pause(500)
    kBit.run(KBitDir.TurnLeft, 40)
    basic.pause(1000)
    kBit.carStop()
    basic.pause(500)
    kBit.run(KBitDir.TurnRight, 40)
    basic.pause(1000)
    kBit.carStop()
    basic.pause(500)
    kBit.carStop()
}

//change pin to pin 5
let strip = neopixel.create(DigitalPin.P8, 18, NeoPixelMode.RGB)

/**
 * Testing the neopixel should show red, orange, yellow, green and blue, for a second each
 */
testNeopixel()

/**
 * Testing the motors will make the robot move forwards, backwards, turn left and turn right
 */
testMovement()

/**
 * After testing the neopixel and the motors, the microbit will display the 
 * distance the ultrasonic sensor measures on neopixel ring
 */

basic.forever(function () {
    serial.writeNumber(kBit.ultra())
    serial.writeLine("")
    strip.showBarGraph(kBit.ultra(), 30)
    followLine()
})