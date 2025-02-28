import * as Chat2Gen from '../../../../../actions/chat2-gen'
import * as Container from '../../../../../util/container'
import * as Kb from '../../../../../common-adapters/mobile.native'
import * as React from 'react'
import * as Reanimated from 'react-native-reanimated'
import * as RowSizes from '../../sizes'
import * as Styles from '../../../../../styles'
import type {Props} from '.'
import {RectButton} from 'react-native-gesture-handler'
import {Swipeable} from '../../../../../common-adapters/swipeable.native'
import {ConversationIDKeyContext} from '../contexts'

const Action = (p: {
  text: string
  mult: number
  color: Styles.Color
  iconType: Kb.IconType
  onClick: () => void
  progress: Reanimated.SharedValue<number>
}) => {
  const {text, color, iconType, onClick, progress, mult} = p
  const as = Reanimated.useAnimatedStyle(() => ({
    transform: [{translateX: -mult * progress.value}],
  }))

  return (
    <Reanimated.default.View style={[styles.action, as]}>
      <RectButton style={[styles.rightAction, {backgroundColor: color as string}]} onPress={onClick}>
        <Kb.Icon type={iconType} color={Styles.globalColors.white} />
        <Kb.Text type="BodySmall" style={styles.actionText}>
          {text}
        </Kb.Text>
      </RectButton>
    </Reanimated.default.View>
  )
}

const SwipeConvActions = React.memo(function SwipeConvActions(p: Props) {
  const {swipeCloseRef, children} = p
  const conversationIDKey = React.useContext(ConversationIDKeyContext)
  const [extraData, setExtraData] = React.useState(0)

  React.useEffect(() => {
    // only if open
    if (swipeCloseRef?.current) {
      setExtraData(d => d + 1)
    }
  }, [swipeCloseRef, conversationIDKey])

  const dispatch = Container.useDispatch()
  const onHideConversation = Container.useEvent(() => {
    dispatch(Chat2Gen.createHideConversation({conversationIDKey}))
  })
  const onMuteConversation = Container.useEvent(() => {
    dispatch(Chat2Gen.createMuteConversation({conversationIDKey, muted: !isMuted}))
  })

  const isMuted = Container.useSelector(state => state.chat2.mutedMap.get(conversationIDKey) ?? false)

  const onMute = Container.useEvent(() => {
    onMuteConversation()
    swipeCloseRef?.current?.()
  })

  const onHide = Container.useEvent(() => {
    onHideConversation()
    swipeCloseRef?.current?.()
  })

  const makeActions = Container.useEvent((progress: Reanimated.SharedValue<number>) => (
    <Kb.NativeView style={styles.container}>
      <Action
        text={isMuted ? 'Unmute' : 'Mute'}
        color={Styles.globalColors.orange}
        iconType="iconfont-shh"
        onClick={onMute}
        mult={0}
        progress={progress}
      />
      <Action
        text="Hide"
        color={Styles.globalColors.greyDarker}
        iconType="iconfont-hide"
        onClick={onHide}
        mult={0.5}
        progress={progress}
      />
    </Kb.NativeView>
  ))

  const props = {
    children,
    extraData,
    makeActions,
    swipeCloseRef,
  }

  return <SwipeConvActionsImpl {...props} />
})

type IProps = {
  children: React.ReactNode
  extraData: unknown
  swipeCloseRef: Props['swipeCloseRef']
  makeActions: (progress: Reanimated.SharedValue<number>) => React.ReactNode
}

const SwipeConvActionsImpl = React.memo(function SwipeConvActionsImpl(props: IProps) {
  const {children, swipeCloseRef, makeActions, extraData} = props
  return (
    <Swipeable
      actionWidth={128}
      swipeCloseRef={swipeCloseRef}
      makeActions={makeActions}
      style={styles.row}
      extraData={extraData}
    >
      {children}
    </Swipeable>
  )
})

const styles = Styles.styleSheetCreate(
  () =>
    ({
      action: {
        height: '100%',
        left: 0,
        position: 'absolute',
        top: 0,
        width: 64,
      },
      actionText: {
        backgroundColor: 'transparent',
        color: Styles.globalColors.white,
      },
      container: {
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: 128,
      },
      rightAction: {
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      },
      row: {
        flexShrink: 0,
        height: RowSizes.smallRowHeight,
      },
    } as const)
)

export default SwipeConvActions
