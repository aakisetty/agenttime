'use client'

import React, { useState, useEffect, useCallback } from 'react'
import * as SliderPrimitive from "@radix-ui/react-slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Check } from "lucide-react"
import SplitFlapDisplay from './SplitFlapDisplay'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={`relative flex w-full touch-none select-none items-center ${className}`}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
      <SliderPrimitive.Range className="absolute h-full bg-[rgb(232,128,76)]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-[rgb(232,128,76)] bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export function TimeValueCalculator() {
  const [step, setStep] = useState(0)
  const [hourlyRate, setHourlyRate] = useState(50)
  const [totalHours, setTotalHours] = useState(8) // 4 questions * 2 hours default
  const [questionHours, setQuestionHours] = useState([2, 2, 2, 2])
  const [calculatedValue, setCalculatedValue] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [initialValues, setInitialValues] = useState({ questionHours: [2, 2, 2, 2], hourlyRate: 50 })

  const subscriptionCost = 250 // SnapHomz subscription cost per month

  const questions = [
    "Time spent on Converting Leads",
    "Time Spent with existing Customers",
    "Time Spent on Hiring & Managing Contractors",
    "Time Spent on understanding the market"
  ]

  const descriptions = [
    "Talking to new leads, answering questions, signing contracts",
    "Providing guidance on price, Discussing Disclosures, Contracts, Showings, Offers, Closing services",
    "Staging, Renovations, Inspections, Repairs",
    "Comparative Market Analysis, Property Specific Analytics, Disclosure Specific Research, Financing options for customers"
  ]

  const checkValuesChanged = useCallback(() => {
    return JSON.stringify(questionHours) !== JSON.stringify(initialValues.questionHours) ||
      hourlyRate !== initialValues.hourlyRate
  }, [questionHours, hourlyRate, initialValues])

  useEffect(() => {
    const total = questionHours.reduce((sum, hours) => sum + hours, 0)
    setTotalHours(total)
    const value = total * hourlyRate * 4 - subscriptionCost // Assuming 4 weeks per month
    setCalculatedValue(Math.max(0, value)) // Ensure the value is not negative

    if (completed && checkValuesChanged()) {
      setCompleted(false)
    }
  }, [questionHours, hourlyRate, completed, checkValuesChanged])

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else if (!completed) {
      setCompleted(true)
      setInitialValues({ questionHours: [...questionHours], hourlyRate })
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
      if (completed) {
        setCompleted(false)
      }
    }
  }

  const updateQuestionHours = (value: number[]) => {
    const newHours = [...questionHours]
    newHours[step] = value[0]
    setQuestionHours(newHours)
    if (completed) {
      setCompleted(false)
    }
  }

  const isLastStep = step === questions.length - 1

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 max-w-6xl mx-auto bg-gray-100">
      <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">How much is your time worth to you?</h1>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">{questions[step]}</h2>
          <p className="text-sm text-gray-600">{descriptions[step]}</p>
          <div>
            <p className="text-sm text-gray-600 mb-2">Hours spent per week on this task</p>
            <Slider
              value={[questionHours[step]]}
              onValueChange={updateQuestionHours}
              max={20}
              step={1}
              className="mb-2"
            />
            <p className="font-semibold text-gray-700">{questionHours[step]} hours</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">How much 1 hour of your time is worth to you</p>
            <Input
              type="number"
              value={hourlyRate}
              onChange={(e) => {
                setHourlyRate(Number(e.target.value))
                if (completed) {
                  setCompleted(false)
                }
              }}
              className="w-full mb-4 text-gray-700"
              placeholder="Enter hourly rate"
            />
          </div>
          <div className="flex justify-between space-x-4">
            {step > 0 && (
              <Button onClick={handleBack} className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
            <Button 
              onClick={handleNext} 
              className={`flex-1 ${completed ? 'bg-green-500 hover:bg-green-600' : 'bg-[rgb(232,128,76)] hover:bg-[rgb(212,108,56)]'} text-white`}
            >
              {completed ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Completed
                </>
              ) : (
                <>
                  {isLastStep ? 'Complete' : 'Next'} <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg space-y-4">
          <h2 className="text-xl font-semibold">Return on investment per month with SnapHomz</h2>
          <SplitFlapDisplay value={calculatedValue} />
          <p className="text-gray-400">Or {totalHours * 4} hours of your life</p>
          <Button className="w-full bg-[rgb(232,128,76)] hover:bg-[rgb(212,108,56)] text-white">
            Start your free trial
          </Button>
          <div className="space-y-2 mt-4">
            <h3 className="font-semibold">How did we get this number?</h3>
            <div className="flex justify-between">
              <span>Hours saved per month</span>
              <span>{totalHours * 4} hours</span>
            </div>
            <div className="flex justify-between">
              <span>Value of SnapHomz for saving {totalHours * 4} hours of your time</span>
              <span>${(totalHours * hourlyRate * 4).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Cost of SnapHomz subscription per month</span>
              <span>${subscriptionCost}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total ROI per month</span>
              <span>${calculatedValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100">
      <TimeValueCalculator />
    </div>
  )
}