import * as Styles from '../../styles'
import * as Kb from '../../common-adapters'
import * as Types from '../../constants/types/fs'
import {useFuseClosedSourceConsent} from './hooks'
import * as FsGen from '../../actions/fs-gen'
import {fileUIName} from '../../constants/platform'
import * as Container from '../../util/container'

type Props = {
  mode: 'Icon' | 'Button'
}

const SFMIPopup = (props: Props) => {
  const driverStatus = Container.useSelector(state => state.fs.sfmi.driverStatus)
  const dispatch = Container.useDispatch()
  const enableDriver = () => dispatch(FsGen.createDriverEnable())
  const {canContinue, component: fuseConsentComponent} = useFuseClosedSourceConsent(
    driverStatus.type === Types.DriverStatusType.Disabled && driverStatus.isEnabling,
    undefined,
    undefined
  )

  const {toggleShowingPopup, showingPopup, popup, popupAnchor} = Kb.usePopup(attachTo => (
    <Kb.Overlay
      style={styles.popup}
      attachTo={attachTo}
      visible={showingPopup}
      onHidden={toggleShowingPopup}
      position="bottom right"
    >
      <Kb.Box
        style={styles.container}
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <Kb.Box2 direction="horizontal" centerChildren={true} style={styles.fancyFinderIcon}>
          <Kb.Icon type="icon-fancy-finder-132-96" />
        </Kb.Box2>
        <Kb.Text type="BodyBig" style={styles.text}>
          Enable Keybase in {fileUIName}?
        </Kb.Text>
        <Kb.Text type="BodySmall" style={styles.text} center={true}>
          Get access to your files and folders just like you normally do with your local files. It's encrypted
          and secure.
        </Kb.Text>
        <Kb.Divider style={styles.divider} />
        {fuseConsentComponent}
        <Kb.Box2 direction="horizontal" fullWidth={true} centerChildren={true} style={styles.buttonBox}>
          <Kb.Button
            type="Success"
            label="Yes, enable"
            waiting={driverStatus.type === Types.DriverStatusType.Disabled && driverStatus.isEnabling}
            disabled={!canContinue}
            onClick={enableDriver}
          />
        </Kb.Box2>
      </Kb.Box>
    </Kb.Overlay>
  ))

  if (driverStatus.type !== Types.DriverStatusType.Disabled) {
    return null
  }
  return (
    <>
      {props.mode === 'Icon' ? (
        <Kb.WithTooltip tooltip={`Show in ${fileUIName}`}>
          <Kb.Icon
            type="iconfont-finder"
            padding="tiny"
            fontSize={16}
            color={Styles.globalColors.black_50}
            hoverColor={Styles.globalColors.black}
            onClick={toggleShowingPopup}
            ref={popupAnchor as any}
          />
        </Kb.WithTooltip>
      ) : (
        <Kb.Button
          mode="Secondary"
          small={true}
          label={`Enable ${fileUIName} integration`}
          onClick={toggleShowingPopup}
          ref={popupAnchor}
        />
      )}
      {popup}
    </>
  )
}

const styles = Styles.styleSheetCreate(() => ({
  buttonBox: {
    paddingBottom: Styles.globalMargins.tiny,
    paddingLeft: Styles.globalMargins.small,
    paddingRight: Styles.globalMargins.small,
    paddingTop: Styles.globalMargins.small,
  },
  container: {
    ...Styles.globalStyles.flexBoxColumn,
    width: '100%',
  },
  divider: {
    marginBottom: Styles.globalMargins.tiny,
    marginTop: Styles.globalMargins.small,
  },
  fancyFinderIcon: {
    paddingLeft: Styles.globalMargins.small,
    paddingRight: Styles.globalMargins.small,
    paddingTop: Styles.globalMargins.medium,
  },
  popup: {
    backgroundColor: Styles.globalColors.white,
    marginTop: Styles.globalMargins.tiny,
    overflow: 'visible',
    padding: Styles.globalMargins.small,
    width: 260,
  },
  text: {
    paddingLeft: Styles.globalMargins.small,
    paddingRight: Styles.globalMargins.small,
    paddingTop: Styles.globalMargins.tiny,
  },
}))
export default SFMIPopup
