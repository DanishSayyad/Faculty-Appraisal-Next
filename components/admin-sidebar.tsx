"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/AuthProvider'
import {
  UserPlus,
  Users,
  UserCheck,
  X,
  Building,
  LogOut,
  ChevronDown,
  ChevronRight,
  BarChart2,
  Menu,
  ChevronLeft,
} from 'lucide-react'

interface AdminSidebarProps {
  isOpen?: boolean
  isExpanded?: boolean
  onClose?: () => void
  onToggle?: () => void
}

interface NavItem {
  icon: React.ElementType
  label: string
  path: string
}

export default function AdminSidebar({ 
  isOpen = false, 
  isExpanded = false, 
  onClose = () => {}, 
  onToggle = () => {} 
}: AdminSidebarProps) {
  const [isManageFacultyOpen, setIsManageFacultyOpen] = useState(false)
  const [isVerificationTeamOpen, setIsVerificationTeamOpen] = useState(false)
  const { logout, user } = useAuth()
  const location = usePathname()

  // Group nav links into categories for dropdowns
  const facultyLinks: NavItem[] = [
    { icon: UserPlus, label: 'Add Faculty', path: '/admin/add-faculty' },
    { icon: Users, label: 'Faculty List', path: '/admin/faculty' },
    { icon: BarChart2, label: 'Summary', path: '/admin/summary' },
  ]

  const verificationLinks: NavItem[] = [
    { icon: UserCheck, label: 'Verification Team', path: '/admin/verification-team' },
    { icon: UserCheck, label: 'Assign Faculty to Verification Team', path: '/admin/assign-faculty-to-verification-team' },
  ]

  const otherLinks: NavItem[] = [
    { icon: Building, label: 'Assign Dean To Department', path: '/admin/assign-dean-to-department' },
  ]

  // Auto-open dropdown menus based on current path when component mounts
  useEffect(() => {
    const currentPath = location

    // Check if current path is in faculty links
    const isFacultyPath = ['/admin/add-faculty', '/admin/faculty', '/admin/summary'].includes(currentPath)
    const isVerificationPath = ['/admin/verification-team', '/admin/assign-faculty-to-verification-team'].includes(currentPath)

    if (isFacultyPath) {
      setIsManageFacultyOpen(true)
    }

    if (isVerificationPath) {
      setIsVerificationTeamOpen(true)
    }
  }, [location])

  const toggleManageFaculty = () => {
    if (isExpanded) {
      setIsManageFacultyOpen(!isManageFacultyOpen)
    } else {
      onToggle()
      setIsManageFacultyOpen(true)
    }
  }

  const toggleVerificationTeam = () => {
    if (isExpanded) {
      setIsVerificationTeamOpen(!isVerificationTeamOpen)
    } else {
      onToggle()
      setIsVerificationTeamOpen(true)
    }
  }

  const isActive = (path: string) => {
    return location === path
  }

  interface NavLinkProps {
    item: NavItem
    isActive: boolean
    isDropdownItem?: boolean
  }

  const NavLink = ({ item, isActive, isDropdownItem = false }: NavLinkProps) => {
    const Icon = item.icon
    return (
      <Link
        href={item.path}
        onClick={() => {
          if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            onClose()
          }
        }}
        className={`
          flex items-center ${isExpanded ? 'space-x-3' : 'justify-center'} p-3 rounded-lg
          transition-all duration-200 ease-in-out
          hover:scale-[1.02] transform relative group
          ${
            isDropdownItem && isExpanded
              ? `
                ml-3 border-l-2 border-indigo-500 pl-4
                before:content-[""]
                before:absolute
                before:left-[-0.75rem]
                before:top-1/2
                before:w-3
                before:h-[2px]
                before:bg-indigo-500
              `
              : ''
          }
          ${
            isActive
              ? 'bg-indigo-700 text-white shadow-md'
              : 'text-indigo-100 hover:bg-indigo-700/70'
          }
        `}
        title={isExpanded ? '' : item.label}
      >
        {Icon && <Icon size={20} strokeWidth={2} className="flex-shrink-0" />}
        {isExpanded && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
      </Link>
    )
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen bg-indigo-800 text-white z-40
        transform transition-all duration-300 ease-in-out
        ${isExpanded ? 'w-72' : 'w-20'} overflow-y-auto flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header Section with Toggle Button */}
        <div className="border-b border-indigo-700">
          <div className="flex items-center justify-between p-4">
            {isExpanded && (
              <h2 className="text-xl font-bold tracking-tight">Admin Panel</h2>
            )}
            <button
              onClick={onToggle}
              className="p-2 hover:bg-indigo-700 rounded-lg transition-all duration-200 hover:scale-110 hidden lg:block"
              title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isExpanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-indigo-700 rounded-full lg:hidden transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <div className={`${isExpanded ? 'px-4' : 'px-2'} py-4 flex-grow overflow-y-auto`}>
          <nav className="space-y-1">
            {/* Faculty Management Dropdown */}
            <div className="mb-2">
              <button
                onClick={toggleManageFaculty}
                className={`w-full flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} p-3 rounded-lg text-indigo-100 hover:bg-indigo-700/70 transition-colors duration-200`}
                title={isExpanded ? '' : 'Manage Faculty'}
              >
                <div className={`flex items-center ${isExpanded ? 'space-x-3' : ''}`}>
                  <Users size={20} strokeWidth={2} />
                  {isExpanded && <span className="text-sm font-medium">Manage Faculty</span>}
                </div>
                {isExpanded && (
                  <div className="transition-transform duration-300 ease-in-out">
                    {isManageFacultyOpen ? (
                      <ChevronDown size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                  </div>
                )}
              </button>

              <div
                className={`
                  overflow-hidden transition-all duration-300 ease-in-out
                  ${isManageFacultyOpen && isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                <div
                  className={`
                  relative pl-3 mt-1
                  before:content-[""]
                  before:absolute
                  before:left-0
                  before:top-0
                  before:bottom-2
                  before:w-[2px]
                  before:bg-indigo-500
                  space-y-1
                `}
                >
                  {facultyLinks.map((item) => (
                    <NavLink
                      key={item.path}
                      item={item}
                      isActive={isActive(item.path)}
                      isDropdownItem={true}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Verification Team Dropdown */}
            <div className="mb-2">
              <button
                onClick={toggleVerificationTeam}
                className={`w-full flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} p-3 rounded-lg text-indigo-100 hover:bg-indigo-700/70 transition-colors duration-200`}
                title={isExpanded ? '' : 'Verification Team'}
              >
                <div className={`flex items-center ${isExpanded ? 'space-x-3' : ''}`}>
                  <UserCheck size={20} strokeWidth={2} />
                  {isExpanded && <span className="text-sm font-medium">Verification Team</span>}
                </div>
                {isExpanded && (
                  <div className="transition-transform duration-300 ease-in-out">
                    {isVerificationTeamOpen ? (
                      <ChevronDown size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                  </div>
                )}
              </button>

              <div
                className={`
                  overflow-hidden transition-all duration-300 ease-in-out
                  ${isVerificationTeamOpen && isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                <div
                  className={`
                  relative pl-3 mt-1
                  before:content-[""]
                  before:absolute
                  before:left-0
                  before:top-0
                  before:bottom-2
                  before:w-[2px]
                  before:bg-indigo-500
                  space-y-1
                `}
                >
                  {verificationLinks.map((item) => (
                    <NavLink
                      key={item.path}
                      item={item}
                      isActive={isActive(item.path)}
                      isDropdownItem={true}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Other links without dropdowns */}
            {otherLinks.map((item) => (
              <NavLink key={item.path} item={item} isActive={isActive(item.path)} isDropdownItem={false} />
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className={`${isExpanded ? 'p-4' : 'p-2'} border-t border-indigo-700`}>
          <button
            onClick={logout}
            className={`w-full px-3 py-2.5 bg-indigo-700 text-white rounded-lg hover:bg-red-600 flex items-center justify-center text-sm font-medium transition-colors duration-200`}
            title={isExpanded ? '' : 'Logout'}
          >
            <LogOut className={isExpanded ? 'mr-2' : ''} size={18} />
            {isExpanded && 'Logout'}
          </button>
        </div>
      </div>
    </>
  )
}