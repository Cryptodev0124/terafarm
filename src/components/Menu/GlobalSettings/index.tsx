// import { ButtonProps, CogIcon, Flex, IconButton, useModal } from ''
import { ButtonProps, IconButton } from 'components/Button'
import { Flex } from 'components/Box'
import { CogIcon } from 'components/Svg'
import { useModal } from 'widgets/Modal'

import SettingsModal from './SettingsModal'

type Props = {
  color?: string
  mr?: string
  mode?: string
} & ButtonProps

const GlobalSettings = ({ color, mr = '8px', mode, ...rest }: Props) => {
  const [onPresentSettingsModal] = useModal(<SettingsModal mode={mode} />)

  return (
    <Flex>
      <IconButton
        onClick={onPresentSettingsModal}
        variant="text"
        scale="sm"
        mr={mr}
        id={`open-settings-dialog-button-${mode}`}
        {...rest}
      >
        <CogIcon height={24} width={24} color={color || 'textSubtle'} />
      </IconButton>
    </Flex>
  )
}

export default GlobalSettings
