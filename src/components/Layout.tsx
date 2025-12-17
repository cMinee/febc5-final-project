'use client'

import React from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import ProfileCard from "./ProfileCard"

const navigation = [
  { name: 'Home', href: '/', current: true },
  { name: 'All Courses', href: '/courses', current: false },
  { name: 'My Courses', href: '/my-courses', current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Disclosure as="nav" className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-secondary-200/50 shadow-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-20 items-center justify-between">
            {/* Mobile menu button */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-lg p-2 text-secondary-700 hover:bg-primary-50 hover:text-primary-600 focus:ring-2 focus:ring-primary-500 focus:outline-hidden transition-all duration-200">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
              </DisclosureButton>
            </div>

            {/* Logo and Desktop Navigation */}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center gap-3">
                <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-soft">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="hidden sm:block text-xl font-display font-bold text-secondary-900">
                  CourseHub
                </span>
              </div>
              
              <div className="hidden sm:ml-8 sm:block">
                <div className="flex space-x-2">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? 'page' : undefined}
                      className={classNames(
                        item.current 
                          ? 'bg-primary-50 text-primary-700 font-semibold shadow-inner-soft' 
                          : 'text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900',
                        'rounded-lg px-4 py-2.5 text-base font-medium transition-all duration-200'
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Section */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <ProfileCard/>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        <DisclosurePanel className="sm:hidden border-t border-secondary-200/50 bg-white/95 backdrop-blur-lg">
          <div className="space-y-1 px-4 pt-2 pb-3">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current 
                    ? 'bg-primary-50 text-primary-700 font-semibold shadow-inner-soft' 
                    : 'text-secondary-700 hover:bg-secondary-50',
                  'block rounded-lg px-4 py-3 text-base font-medium transition-all duration-200'
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto backdrop-blur-xl bg-secondary-900/95 text-secondary-100 border-t border-secondary-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-white mb-3">CourseHub</h3>
              <p className="text-sm text-secondary-300">
                Your gateway to quality online learning. Discover, learn, and grow with our curated courses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors">About Us</a></li>
                <li><a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors">Contact</a></li>
                <li><a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors">Facebook</a></li>
                <li><a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors">Twitter</a></li>
                <li><a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-secondary-800 text-center">
            <p className="text-sm text-secondary-400" suppressHydrationWarning>
              &copy; {new Date().getFullYear()} CourseHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

