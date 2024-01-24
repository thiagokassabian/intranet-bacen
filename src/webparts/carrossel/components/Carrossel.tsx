import React, { useEffect, useState } from "react"
import styles from "./Carrossel.module.scss"
import "./carrossel-custom.css"
import { ICarrosselProps } from "./ICarrosselProps"
import { SPFx, spfi } from "@pnp/sp"
import { carrossel } from "./script"
import { FontIcon } from "@fluentui/react"
import { getSP } from "../../pnpjsConfig"

const Carrossel: React.FunctionComponent<ICarrosselProps> = props => {
	const { context } = props
	const id = "carrossel-custom"
	const [pages, setPages] = useState<any[]>([])

	useEffect(() => {
		getSP(context)

		const getPages = async (): Promise<void> => {
			//* Pegar itens de lista de outro site
			const url = `${context.pageContext.web.absoluteUrl}/sites/conexaoreal`
			console.log(url)
			const sp = spfi(url).using(SPFx(context))
			console.log(sp)
			const lists = await sp.web.lists.getByTitle("Páginas do Site").items()
			console.log(lists)
			setPages(lists)
			console.log(pages)
		}
		getPages().catch(console.log)

		carrossel(id)
	}, [])

	const handleDragStart = (e: React.MouseEvent): void => e.preventDefault()

	const items = pages.map((item, index) => (
		<div
			className={`${styles.item} ${item.TipoDeNoticia === "Vídeo" && styles.video}`}
			key={index}
			onClick={() => console.log(item)}
			onDragStart={handleDragStart}>
			<div
				className={`${styles.image} image`}
				style={{
					backgroundImage: `url('${item.BannerImageUrl ? item.BannerImageUrl.Url : ""}')`
				}}
			/>
			<div className={styles.text}>{item.Title}</div>
		</div>
	))

	return (
		<>
			<div id={id} className={`${styles.carrossel} carrossel`}>
				<div className={`${styles.items} items`}>{items}</div>
				<div className={`${styles.left} left d-none`}>
					<FontIcon className={styles.icon} iconName="DoubleChevronLeft" />
				</div>
				<div className={`${styles.right} right`}>
					<FontIcon className={styles.icon} iconName="DoubleChevronRight" />
				</div>
			</div>
		</>
	)
}

export default Carrossel
