import { RightAsideButtons } from '../right-aside-buttons'
import { InfoCardSession } from './info-card-session'
import { InfoCardTask } from './info-card-task'

function InfoCards() {
  return (
    <div className="flex w-1/3 flex-col gap-4">
      <InfoCardSession />
      <InfoCardTask />
      <RightAsideButtons />
    </div>
  )
}

export { InfoCards }
