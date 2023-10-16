import * as React from "react"
import { useState, useEffect } from "react"
import styles from "./Destaque.module.scss"
import { IDestaqueProps } from "./IDestaqueProps"
import { getSP } from "../../pnpjsConfig"
import { SPFI } from "@pnp/sp"
import { ISitePage } from "../../interfaces"
// import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder"

const Destaque: React.FunctionComponent<IDestaqueProps> = props => {
	const { context, selectedPageId, selectedSitePage, destaque } = props

	const sp: SPFI = getSP(context)
	const [page, setPage] = useState<ISitePage>()

	useEffect(() => {
		if (selectedPageId) {
			const getPage = async (): Promise<ISitePage> => await sp.web.lists.getByTitle("Páginas do site").items.getById(selectedPageId)()
			getPage().then(setPage).catch(console.log)
		}
	}, [selectedPageId])

	return (
		<div className={styles.destaque}>
			{/* <Placeholder
				iconName="Edit"
				iconText="Configure your web part"
				description="Please configure the web part."
				buttonLabel="Configure"
				onConfigure={onConfigure}
				// theme={this.props.themeVariant}
			/> */}
			<a href={selectedSitePage ? (page ? "SitePages/" + page.Title + ".aspx" : "#") : destaque.Url}>
				<div className={`${styles["container-fluid"]} ${styles["gx-0"]}`}>
					<div className={styles.row}>
						<div className={`${styles["col-lg-7"]} ${styles["mb-2"]} ${styles["mb-lg-0"]}`}>
							<div
								className={`${styles.image}`}
								style={{
									backgroundImage: `url(${
										selectedSitePage
											? page
												? page.BannerImageUrl.Url
												: ""
											: destaque.Image
											? destaque.Image.fileAbsoluteUrl
											: ""
									})`
								}}
							/>
						</div>
						<div className={`${styles["col-lg-5"]}`}>
							<div className={styles.text}>
								<div className={styles.text__tag}>{selectedSitePage ? (page ? page.OData__TopicHeader : null) : destaque.Tag}</div>
								<h2 className={styles.text__title}>{selectedSitePage ? (page ? page.Title : null) : destaque.Title}</h2>
								<div className={styles.text__lead}>{selectedSitePage ? (page ? page.Lead : null) : destaque.Text}</div>
							</div>
						</div>
					</div>
				</div>
			</a>
		</div>
	)
}

export default Destaque
