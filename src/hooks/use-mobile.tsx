
import * as React from "react"

const MOBILE_BREAKPOINT = 640  // sm breakpoint
const TABLET_BREAKPOINT = 1024 // lg breakpoint

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    checkIsMobile()
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    if (mql.addEventListener) {
      mql.addEventListener("change", checkIsMobile)
      return () => mql.removeEventListener("change", checkIsMobile)
    } else {
      mql.addListener(checkIsMobile)
      return () => mql.removeListener(checkIsMobile)
    }
  }, [])

  return isMobile
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkIsTablet = () => {
      const width = window.innerWidth
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT)
    }
    
    checkIsTablet()
    
    const mql = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`)
    
    if (mql.addEventListener) {
      mql.addEventListener("change", checkIsTablet)
      return () => mql.removeEventListener("change", checkIsTablet)
    } else {
      mql.addListener(checkIsTablet)
      return () => mql.removeListener(checkIsTablet)
    }
  }, [])

  return isTablet
}

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= TABLET_BREAKPOINT)
    }
    
    checkIsDesktop()
    
    const mql = window.matchMedia(`(min-width: ${TABLET_BREAKPOINT}px)`)
    
    if (mql.addEventListener) {
      mql.addEventListener("change", checkIsDesktop)
      return () => mql.removeEventListener("change", checkIsDesktop)
    } else {
      mql.addListener(checkIsDesktop)
      return () => mql.removeListener(checkIsDesktop)
    }
  }, [])

  return isDesktop
}
