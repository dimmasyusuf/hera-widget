
const useFlexLayout = () => {
  const verticalContainerProps: React.CSSProperties = {
    flexDirection: 'column',
    position: 'relative',
    height: '100%',
    overflow: 'hidden'
  }
  const horizontalContainerProps: React.CSSProperties = {
    flexDirection: 'row',
    position: 'relative',
    width: '100%',
    overflow: 'hidden'
  }
  return {
    verticalContainerProps,
    horizontalContainerProps
  }
}

export default useFlexLayout