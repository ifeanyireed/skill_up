import { useJourneyStore } from '../store/useJourneyStore'
import { PlannerLayout } from '../components/planner/PlannerLayout'
import { Step1Intent } from '../components/planner/steps/Step1Intent'
import { Step2Pickup } from '../components/planner/steps/Step2Pickup'
import { Step3Destination } from '../components/planner/steps/Step3Destination'
import { Step4Passengers } from '../components/planner/steps/Step4Passengers'
import { Step5Schedule } from '../components/planner/steps/Step5Schedule'
import { Step6Extras } from '../components/planner/steps/Step6Extras'
import { Step7Recommendation } from '../components/planner/steps/Step7Recommendation'
import { Step8Review } from '../components/planner/steps/Step8Review'
import { Step9Estimate } from '../components/planner/steps/Step9Estimate'
import { Step10Success } from '../components/planner/steps/Step10Success'
import { AnimatePresence, motion } from 'framer-motion'

export function JourneyPlannerPage() {
  const { currentStep } = useJourneyStore()

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Intent />
      case 2: return <Step2Pickup />
      case 3: return <Step3Destination />
      case 4: return <Step4Passengers />
      case 5: return <Step5Schedule />
      case 6: return <Step6Extras />
      case 7: return <Step7Recommendation />
      case 8: return <Step8Review />
      case 9: return <Step9Estimate />
      case 10: return <Step10Success />
      default: return <Step1Intent />
    }
  }

  return (
      <PlannerLayout>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </PlannerLayout>
  )
}
