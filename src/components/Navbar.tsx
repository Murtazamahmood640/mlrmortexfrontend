"use client"

import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })
import { useAuth } from "../contexts/AuthContext"
import { Calendar, Menu, X, User, LogOut, Settings, Home, Image, Phone } from "lucide-react"

// shadcn components (path assumes "@/components/ui/*" alias)
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const getDashboardLink = () => {
    if (user?.role === "admin") return "/admin"
    if (user?.role === "organizer") return "/organizer"
    return "/dashboard"
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-">
              <Calendar className="h-8 w-8 text-yellow-400" />
              <span className="text-lg font-semibold text-white">EventSphere</span>
            </Link>
            <span className="hidden sm:inline text-sm text-muted-foreground">
              Manage events easily
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center space-x-4 text-white">
                <NavigationMenuItem>
                  <Link to="/" className="text-sm font-medium hover:underline flex items-center gap-2" onClick={scrollToTop}>
                    <Home className="h-4 w-4 text-yellow-400" />
                    Home
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/events" className="text-sm font-medium hover:underline flex items-center gap-2" onClick={scrollToTop}>
                    <Calendar className="h-4 w-4 text-yellow-400" />
                    Events
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/gallery" className="text-sm font-medium hover:underline flex items-center gap-2" onClick={scrollToTop}>
                    <Image className="h-4 w-4 text-yellow-400" />
                    Gallery
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/about" className="text-sm font-medium hover:underline flex items-center gap-2" onClick={scrollToTop}>
                    <User className="h-4 w-4 text-yellow-400" />
                    About
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/contact" className="text-sm font-medium hover:underline flex items-center gap-2" onClick={scrollToTop}>
                    <Phone className="h-4 w-4 text-yellow-400" />
                    Contact
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side (actions + user) */}
          <div className="flex items-center space-x-4">
            {/* Create Event button */}
            {/* <div className="hidden md:block">
              <Button onClick={() => navigate("/create")} className="bg-yellow-500 text-white hover:bg-yellow-600">Create Event</Button>
            </div> */}

            {/* User area */}
            <div className="hidden md:block">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="inline-flex items-center gap-2 ">
                      <Avatar className="h-8 w-8 bg-white ">
                        {/* If you have avatar image use AvatarImage */}
                        <AvatarFallback className="bg-black">
                          <User className="h-5 w-5 text-yellow-400 " />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-white font-medium">{user?.fullName ?? "User"}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardLink()} onClick={scrollToTop}>
                        <Settings className="mr-2 h-4 w-4 inline" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        handleLogout()
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4 inline" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="text-sm font-medium text-white" onClick={scrollToTop}>
                    Login
                  </Link>
                  <Button onClick={() => navigate("/register")}  className="bg-yellow-500 text-white hover:bg-yellow-600">Register</Button>
                </div>
              )}
            </div>

            {/* Mobile hamburger -> uses shadcn Sheet as slide-over */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button aria-label="Open menu" className="p-1">
                    <Menu className="h-6 w-6" />
                  </button>
                </SheetTrigger>
                <SheetContent position="right" size="sm" className="px-4">
                  <div className="flex items-center justify-between mb-4">
                    <Link to="/" onClick={() => { setIsMenuOpen(false); scrollToTop(); }} className="flex items-center gap-2">
                      <Calendar className="h-7 w-7" />
                      <span className="text-lg font-semibold">EventSphere</span>
                    </Link>
                    <button onClick={() => setIsMenuOpen(false)} aria-label="Close">
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <Link to="/" className="flex items-center gap-2" onClick={() => { setIsMenuOpen(false); scrollToTop(); }}>
                      <Home className="h-4 w-4" />
                      Home
                    </Link>
                    <Link to="/events" onClick={() => { setIsMenuOpen(false); scrollToTop(); }}>
                      Events
                    </Link>
                    <Link to="/gallery" className="flex items-center gap-2" onClick={() => { setIsMenuOpen(false); scrollToTop(); }}>
                      <Image className="h-4 w-4" />
                      Gallery
                    </Link>
                    <Link to="/about" onClick={() => { setIsMenuOpen(false); scrollToTop(); }}>
                      About
                    </Link>
                    <Link to="/contact" onClick={() => { setIsMenuOpen(false); scrollToTop(); }}>
                      Contact
                    </Link>

                    <div className="pt-4 border-t mt-2">
                      {isAuthenticated ? (
                        <>
                          <div className="mb-2 text-sm font-medium">{user?.fullName}</div>
                          <Link to={getDashboardLink()} className="flex items-center gap-2 mb-2" onClick={() => { setIsMenuOpen(false); scrollToTop(); }}>
                            <Settings className="h-4 w-4" />
                            Dashboard
                          </Link>
                          <button onClick={handleLogout} className="flex items-center gap-2">
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link to="/login" className="block mb-2" onClick={() => { setIsMenuOpen(false); scrollToTop(); }}>
                            Login
                          </Link>
                          <Button onClick={() => { setIsMenuOpen(false); navigate("/register") }}>Register</Button>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
