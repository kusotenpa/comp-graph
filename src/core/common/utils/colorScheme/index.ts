import { useComputedColorScheme, useMantineColorScheme } from '@mantine/core'

export const useColorScheme = () => {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light')

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')
  }

  return {
    colorScheme: computedColorScheme,
    toggleColorScheme,
  }
}
