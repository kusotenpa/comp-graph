import { createRootRoute, Outlet } from '@tanstack/react-router'
import { MantineProvider, createTheme } from '@mantine/core'
import '@mantine/core/styles.css'

const theme = createTheme({})

const RootComponent = () => {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Outlet />
    </MantineProvider>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
