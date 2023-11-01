import React, { useState, useEffect } from "react"
import styles from "./Destaque.module.scss"
import { IDestaqueProps } from "./IDestaqueProps"
import { getSP } from "../../pnpjsConfig"
import { SPFI } from "@pnp/sp"
import { ISitePage } from "../../interfaces"
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder"

const Destaque: React.FunctionComponent<IDestaqueProps> = props => {
	const { context, selectedPageId, selectedSitePage, destaque, onConfigure } = props

	const sp: SPFI = getSP(context)
	const [page, setPage] = useState<ISitePage | null>(null)

	useEffect(() => {
		if (selectedPageId) {
			const getPage = async (): Promise<ISitePage> => await sp.web.lists.getByTitle("Páginas do site").items.getById(selectedPageId)()
			getPage()
				.then(result => {
					setPage({ ...result, ImagemDestaque: JSON.parse(result.ImagemDestaque.toString()) })
					console.log({ ...result, ImagemDestaque: JSON.parse(result.ImagemDestaque.toString()) })
				})
				.catch(console.log)
		} else {
			setPage(null)
		}
	}, [selectedPageId])

	// useEffect(() => {
	// 	if (!selectedSitePage) setPage(null)
	// }, [selectedSitePage])

	console.log(!page)
	console.log(page !== null)
	console.log(selectedPageId)
	console.log(destaque)

	return (
		<div className={styles.destaque}>
			{(!selectedSitePage && (!destaque.Title || !destaque.Image)) || (selectedSitePage && !selectedPageId) ? (
				<Placeholder
					iconName="Edit"
					iconText="Destaque"
					description="Por favor, configure a web part."
					buttonLabel="Configurar"
					onConfigure={onConfigure}
					contentClassName={styles.placeholder}
				/>
			) : (
				<a href={selectedSitePage ? (page ? "SitePages/" + page.Title + ".aspx" : "#") : destaque.Url}>
					<div className={`${styles["container-fluid"]} ${styles["gx-0"]}`}>
						<div className={styles.row}>
							<div className={`${styles["col-lg-6"]} ${styles["mb-2"]} ${styles["mb-lg-0"]}`}>
								<div
									className={`${styles.image}`}
									style={{
										backgroundImage: `url(${
											selectedSitePage
												? page
													? page.ImagemDestaque
														? `${page.ImagemDestaque.serverUrl}${page.ImagemDestaque.serverRelativeUrl}`
														: ""
													: ""
												: destaque.Image
												? destaque.Image.fileAbsoluteUrl
												: ""
										})`
									}}
								/>
							</div>
							<div className={`${styles["col-lg-6"]}`}>
								<div className={styles.text}>
									{((selectedSitePage && page) || destaque.Tag) && (
										<div className={styles.text__tag}>
											{selectedSitePage ? (page ? page.OData__TopicHeader : null) : destaque.Tag}
										</div>
									)}
									<h2 className={styles.text__title}>{selectedSitePage ? (page ? page.Title : null) : destaque.Title}</h2>
									{((selectedSitePage && page) || destaque.Text) && (
										<div className={styles.text__lead}>{selectedSitePage ? (page ? page.Lead : null) : destaque.Text}</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</a>
			)}
		</div>
	)
}

export default Destaque
