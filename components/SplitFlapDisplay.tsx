import React, { useState, useEffect } from 'react'

const ANIMATION_DURATION = 150 // milliseconds per flip
const DIGIT_DELAY = 50 // milliseconds delay between each digit flip

const SplitFlapDisplay: React.FC<{ value: number }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState("0")
  const [flipping, setFlipping] = useState<number[]>([])

  useEffect(() => {
    const newValue = Math.max(0, Math.round(value)).toString().padStart(7, '0')
    const oldValue = displayValue.padStart(7, '0')
    const flippingDigits: number[] = []

    for (let i = 0; i < 7; i++) {
      if (newValue[i] !== oldValue[i]) {
        flippingDigits.push(i)
        setTimeout(() => {
          setFlipping(prev => {
            const updated = [...prev]
            updated[i] = (updated[i] || 0) + 1
            return updated
          })
        }, i * DIGIT_DELAY)

        setTimeout(() => {
          setFlipping(prev => {
            const updated = [...prev]
            updated[i] = 0
            return updated
          })
        }, i * DIGIT_DELAY + ANIMATION_DURATION)
      }
    }

    setFlipping(new Array(7).fill(0))
    setDisplayValue(newValue)
  }, [value])

  const renderDigit = (digit: string, index: number) => {
    const isFlipping = flipping[index] > 0
    return (
      <div key={index} className="relative inline-block w-16 h-24 mx-0.5 overflow-hidden bg-gray-800">
        <div
          className={`absolute inset-0 flex items-center justify-center text-5xl font-bold transition-transform ${
            isFlipping ? 'animate-flipTop' : ''
          }`}
          style={{
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            transform: `rotateX(${isFlipping ? -90 : 0}deg)`,
            transition: `transform ${ANIMATION_DURATION}ms ease-in-out`,
          }}
        >
          {digit}
        </div>
        <div
          className={`absolute inset-0 flex items-center justify-center text-5xl font-bold transition-transform ${
            isFlipping ? 'animate-flipBottom' : ''
          }`}
          style={{
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            transform: `rotateX(${isFlipping ? 0 : 90}deg)`,
            transition: `transform ${ANIMATION_DURATION}ms ease-in-out`,
          }}
        >
          {digit}
        </div>
      </div>
    )
  }

  const formattedValue = parseInt(displayValue).toLocaleString('en-US')

  return (
    <div className="font-mono text-7xl font-bold flex items-center">
      <span className="mr-2">$</span>
      {formattedValue.split('').map((digit, index) =>
        digit === ',' ? (
          <span key={`comma-${index}`} className="mx-1">,</span>
        ) : (
          renderDigit(digit, index)
        )
      )}
    </div>
  )
}

export default SplitFlapDisplay