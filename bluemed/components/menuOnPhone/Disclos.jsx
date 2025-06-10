
import React from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react'
import { ChevronDown } from "lucide-react";
import { Button } from '@headlessui/react';

const Disclos = () => {
  return (
    <div>
      <Disclosure as="div" className="px-12 mt-10">
        {({ open }) => (
          <>
            <DisclosureButton className="group flex w-full items-center justify-between mb-6">
              <span className="text-sm/6 font-medium text-white group-data-[hover]:text-white/80">
                ექიმის სივრცე
              </span>
              <ChevronDown
                color="white"
                className={`size-5 transition-transform duration-300 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
                />
            </DisclosureButton>
            <Transition
              enter="transition-all duration-300 ease-out"
              enterFrom="opacity-0 max-h-0"
              enterTo="opacity-100 max-h-40"
              leave="transition-all duration-200 ease-in"
              leaveFrom="opacity-100 max-h-40"
              leaveTo="opacity-0 max-h-0"
              >
              <DisclosurePanel className="mt-2 text-sm/5 text-white/50 flex flex-col items-start gap-4">
                <Button>ავტორიზაცია</Button>
                <Button>რეგისტრაცია</Button>
                <Button>აპის გადმოწერა</Button>
              </DisclosurePanel>
            </Transition>
          </>
        )}
      </Disclosure>

      <Disclosure as="div" className="px-12 mt-5">
        {({ open }) => (
          <>
            <DisclosureButton className="group flex w-full items-center justify-between mb-6">
              <span className="text-sm/6 font-medium text-white group-data-[hover]:text-white/80">
                ჩვენს შესახებ
              </span>
              <ChevronDown
                color="white"
                className={`size-5 transition-transform duration-300 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
                />
            </DisclosureButton>
            <Transition
              enter="transition-all duration-300 ease-out"
              enterFrom="opacity-0 max-h-0"
              enterTo="opacity-100 max-h-40"
              leave="transition-all duration-200 ease-in"
              leaveFrom="opacity-100 max-h-40"
              leaveTo="opacity-0 max-h-0"
              >
              <DisclosurePanel className="mt-2 text-sm/5 text-white/50 flex flex-col items-start gap-4">
                <Button>ჩვენ</Button>
                <Button>როგორ მუშაობს</Button>
                <Button>ბლოგი</Button>
                <Button>კონტაქტი</Button>
              </DisclosurePanel>
            </Transition>
          </>
        )}
      </Disclosure>


      <Disclosure as="div" className="px-12 mt-5">
        {({ open }) => (
          <>
            <DisclosureButton className="group flex w-full items-center justify-between mb-6">
              <span className="text-sm/6 font-medium text-white group-data-[hover]:text-white/80">
                წესები და პირობები
              </span>
              <ChevronDown
                color="white"
                className={`size-5 transition-transform duration-300 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
                />
            </DisclosureButton>
            <Transition
              enter="transition-all duration-300 ease-out"
              enterFrom="opacity-0 max-h-0"
              enterTo="opacity-100 max-h-40"
              leave="transition-all duration-200 ease-in"
              leaveFrom="opacity-100 max-h-40"
              leaveTo="opacity-0 max-h-0"
              >
              <DisclosurePanel className="mt-2 text-sm/5 text-white/50 flex flex-col items-start gap-4">
                <Button>როგორც ექიმი</Button>
                <Button>როგორც პაციენტი</Button>
              </DisclosurePanel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  )
}

export default Disclos;

