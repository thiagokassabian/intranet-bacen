import * as React from "react"
import { useEffect } from "react"
import styles from "./MinhaMesa.module.scss"
import { IMinhaMesaProps } from "./IMinhaMesaProps"
// import { escape } from '@microsoft/sp-lodash-subset';
import { useBoolean, useConst, useId } from "@fluentui/react-hooks"
// import { getSP } from "../../pnpjsConfig"
// import { SPFI } from "@pnp/sp"
import { FontSizes, FontWeights, Depths } from "office-ui-fabric-react"
// import { IListaLinkItem } from "../../interfaces"
// import parse from "html-react-parser"
import { DefaultButton, DirectionalHint, FontIcon, Panel, PanelType, TooltipHost } from "@fluentui/react"
import "./MinhaMesa.css"
// import { DisplayMode } from "@microsoft/sp-core-library"

const MinhaMesa: React.FunctionComponent<IMinhaMesaProps> = props => {
	const { context, isOpen: isOpenProp = false } = props
	const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(isOpenProp)
	// const [listsData, setListsData] = useState<IListaLinkItem[][]>([])
	const openTooltipId = useId("tooltip")
	const closeTooltipId = useId("tooltip")
	const OpenButtonId = useId("targetButton")
	const CloseButtonId = useId("targetButton")
	// const sp: SPFI = getSP(context)

	//* Elemento que irá reduzir sua largura ao expandir a Minha Mesa
	const page = document.querySelector(".spAppAndPropertyPanelContainer")
	page?.classList.add(styles.appDiv)

	const midiasSocias = document.querySelector("#midias-sociais")
	const destaqueTexts = document.querySelector(".destaque-texts")
	const elementsToResize = [midiasSocias, destaqueTexts]

	useEffect(() => {
		if (isOpen) {
			elementsToResize.forEach(element => {
				if (element) element.classList.add("resize")
			})
		} else {
			elementsToResize.forEach(element => {
				if (element) element.classList.remove("resize")
			})
		}
	}, [isOpen])

	const fnCallOutProps = (id: string): object => {
		const calloutProps = useConst({
			gapSpace: 0,
			target: `#${id}`
		})
		return calloutProps
	}

	return (
		<div className={styles.minhamesa}>
			<TooltipHost
				content="Abrir Minha Mesa"
				id={openTooltipId}
				calloutProps={fnCallOutProps(OpenButtonId)}
				directionalHint={DirectionalHint.leftCenter}>
				<DefaultButton
					onClick={openPanel}
					className={`${styles["btn-toggle"]} ${styles["btn-toggle--open"]} ${!isOpen ? styles.show : ""}`}
					id={OpenButtonId}
					aria-describedby={openTooltipId}>
					<FontIcon aria-label="Abrir Minha Mesa" iconName="DoubleChevronLeft12" />
				</DefaultButton>
			</TooltipHost>
			<TooltipHost
				content="Fechar Minha Mesa"
				id={closeTooltipId}
				calloutProps={fnCallOutProps(CloseButtonId)}
				directionalHint={DirectionalHint.leftCenter}>
				<DefaultButton
					onClick={dismissPanel}
					className={`${styles["btn-toggle"]} ${styles["btn-toggle--close"]} ${isOpen ? styles.show : ""}`}
					id={CloseButtonId}
					aria-describedby={closeTooltipId}>
					<FontIcon aria-label="Fechar Minha Mesa" iconName="DoubleChevronRight12" />
				</DefaultButton>
			</TooltipHost>
			<Panel
				headerText="Minha mesa"
				isBlocking={false}
				isOpen={isOpen}
				onDismiss={dismissPanel}
				isHiddenOnDismiss={true}
				closeButtonAriaLabel="Fechar"
				type={PanelType.custom}
				customWidth="255px"
				className="minhaMesa__panel"
				styles={{
					main: {
						animation: "unset",
						inset: "48px 0 0 auto"
					},
					hiddenPanel: {
						visibility: "unset"
					},
					navigation: {
						margin: "0 10px",
						alignItems: "center",
						borderRadius: "5px",
						boxShadow: Depths.depth8,
						backgroundColor: "#f0f0f0"
					},
					header: {
						alignSelf: "unset"
					},
					headerText: {
						textAlign: "center",
						fontSize: FontSizes.size14,
						textTransform: "uppercase",
						fontWeight: FontWeights.semibold
					},
					closeButton: {
						marginRight: 0,
						borderRadius: "0 5px 5px 0",
						transition: "background-color .5s",
						"&:hover, &:active": {
							color: "rgb(50, 49, 48)",
							backgroundColor: "#ebebeb"
						}
					},
					commands: {
						margin: "10px 0",
						paddingTop: 0
					},
					content: {
						padding: "0 10px 10px"
					}
				}}>
				<div className={styles.panel}>
					<div className={styles.user}>
						<div className={styles.user__avatar}>
							<img
								src={`/_layouts/15/userphoto.aspx?size=S&username=${context.pageContext.user.loginName}`}
								alt={context.pageContext.user.displayName}
							/>
						</div>
						<div className={styles.user__info}>{context.pageContext.user.displayName}</div>
					</div>
				</div>
			</Panel>
		</div>
	)
}

export default MinhaMesa
