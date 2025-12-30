import React, { type ReactNode } from 'react'

const SimulationsLayout = ({children} : {children: ReactNode}) => {
  return (
    <main className="min-h-dvh">
      {children}
    </main>
  )
}

export default SimulationsLayout
