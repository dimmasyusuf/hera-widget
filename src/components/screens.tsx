import { getParams } from '../lib/getParams'
import { useWidgetContext } from '../providers/WidgetProvider'
import ChatScreen from './screen-chat'
import ScreenForm from './screen-form'
import PreviewScreen from './screen-preview'

const params = getParams()
const d = params?.get('d')

const Screens = () => {
  const { state } = useWidgetContext()
  if (d) {
    return <PreviewScreen />
  }
  return (
    state.convo_id ? <ChatScreen convo_id={state.convo_id} /> : <ScreenForm />
  )
}

export default Screens