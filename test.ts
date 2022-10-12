// tests go here; this will not be compiled when this package is used as an extension.
function Test_Neopixel() {
    strip = neopixel.create(DigitalPin.P5, 18, NeoPixelMode.RGB)
    strip.showColor(neopixel.colors(NeoPixelColors.Red))
    strip.show()
    basic.pause(100)
    strip.showColor(neopixel.colors(NeoPixelColors.Orange))
    strip.show()
    basic.pause(100)
    strip.showColor(neopixel.colors(NeoPixelColors.Yellow))
    strip.show()
    basic.pause(100)
    strip.showColor(neopixel.colors(NeoPixelColors.Green))
    strip.show()
    basic.pause(100)
    strip.clear()
}
function Test_Movement() {
    kBit.run(DIR.RunForward, 50)
    basic.pause(100)
    kBit.carStop()
    kBit.run(DIR.RunBack, 50)
    basic.pause(100)
    kBit.carStop()
    basic.pause(100)
    kBit.run(DIR.TurnLeft, 50)
    basic.pause(100)
    kBit.run(DIR.TurnRight, 50)
    basic.pause(100)
    kBit.carStop()
}
let strip: neopixel.Strip = null
Test_Movement()
Test_Neopixel()