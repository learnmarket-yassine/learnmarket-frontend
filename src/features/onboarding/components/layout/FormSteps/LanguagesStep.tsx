import ConfirmModal from '@/components/layout/ConfirmModal'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import CreateLanguageForm from '@/features/myProfile/components/ui/CreateLanguageForm'
import {
  LanguageLevel,
  ProficiencySelect,
} from '@/features/myProfile/components/ui/ProficiencySelect'
import { LANGUAGES, PROFICIENCY_LEVELS } from '@/lib/Constants'
import { useStore } from '@/store/store'

const LanguagesStep = () => {
  const user = useStore((state) => state.auth.user)
  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <h1 className="max-w-[520px] text-4xl font-bold text-[#1E293B]">
          Looking good. Next, tell us which languages you speak.
        </h1>
        <p className="max-w-[420px] text-sm text-[#4B5563]">
          Yora is global, so clients are often interested to know what languages you speak. English
          is a must, but do you speak any other languages?
        </p>
      </div>
      <div className="flex flex-col space-y-6">
        <div className="space-y-5">
          {(user?.tutorProfile?.languages ?? []).map(() => (
            <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-4">
              <div className="flex flex-col gap-2">
                <Label>Language</Label>
                <SearchableSelect
                  value={''}
                  onValueChange={() => {}}
                  options={LANGUAGES}
                  placeholder="Search language"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Proficiency</Label>

                <ProficiencySelect
                  value={{} as LanguageLevel}
                  onChange={(value) => value.value}
                  options={PROFICIENCY_LEVELS}
                  placeholder="Select level"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="invisible">Delete</Label>
                <ConfirmModal
                  name="language"
                  type="delete"
                  title={'Delete language'}
                  description={'Are you sure you want to delete this language ?'}
                  handleConfirm={() => {}}
                  buttonClassName="border-none"
                  isLoading={false}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="">
          <CreateLanguageForm onboarding />
        </div>
      </div>
    </div>
  )
}

export default LanguagesStep
