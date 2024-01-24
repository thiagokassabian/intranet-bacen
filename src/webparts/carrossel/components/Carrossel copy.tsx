// import React, { useEffect, useRef, useState } from "react"
// import styles from "./Carrossel.module.scss"
// import type { ICarrosselProps } from "./ICarrosselProps"
// // import { escape } from '@microsoft/sp-lodash-subset';

// import AliceCarousel, { EventObject } from "react-alice-carousel"
// import "react-alice-carousel/lib/alice-carousel.css"
// import "./carrossel-custom.css"
// import { Icon } from "@fluentui/react"
// import { SPFx, spfi } from "@pnp/sp"
// import { WebPartContext } from "@microsoft/sp-webpart-base"

// const responsive = {
// 	0: { items: 1 },
// 	576: { items: 2 },
// 	1000: { items: 3 },
// 	1400: { items: 4 },
// 	1800: { items: 5 }
// }

// type Props = {
// 	context: WebPartContext
// }

// const Carrossel: React.FunctionComponent<ICarrosselProps> = (props: Props) => {
// 	const { context } = props
// 	const carouselRef = useRef<AliceCarousel>({} as AliceCarousel)
// 	const [showBtnPrev, setShowBtnPrev] = useState<boolean>(false)
// 	const [showBtnNext, setShowBtnNext] = useState<boolean>(true)
// 	// const buttonNext = useRef(false)

// 	const data = [1, 2, 3, 4, 5]

// 	const element = document.querySelector("#spPageChromeAppDiv")

// 	const getPages = async (): Promise<void> => {
// 		//* Pegar itens de lista de outro site
// 		const webUrl = `${context.pageContext.web.absoluteUrl}/sites/Home`
// 		console.log(webUrl)
// 		const sp2 = spfi(webUrl).using(SPFx(context))
// 		console.log(sp2)
// 		// await sp2.web.lists.getByTitle("Fornecedores").items.select("Title", "ID")().then(console.log)
// 		const listsHome = await sp2.web.lists()
// 		// .getById("1c1a6555-1ae5-479e-aeec-8406a637e5e5").items.select("Title", "ID")().then(console.log)
// 		console.log(listsHome)
// 	}
// 	getPages().catch(console.log)

// 	useEffect(() => {
// 		if (element) {
// 			const observer = new ResizeObserver(mutationRecords => {
// 				carouselRef.current._updateComponent()
// 			})
// 			observer.observe(element)
// 			return () => {
// 				observer.disconnect()
// 			}
// 		}
// 	}, [element])

// 	const handleDragStart = (e: React.MouseEvent): void => e.preventDefault()

// 	const items = data.map((item, index) => (
// 		<div className={styles.card} key={index} data-value={item} onClick={() => console.log(item)} onDragStart={handleDragStart}>
// 			<div className={styles.card__content}>
// 				<div
// 					className={styles.card__image}
// 					style={{
// 						backgroundImage:
// 							"url('https://cdn.hubblecontent.osi.office.net/m365content/publish/00143758-532c-4a86-892c-ba7401b6459e/1267433806.jpg')"
// 					}}
// 				/>
// 				<div className={styles.card__text}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod, dolorum!</div>
// 			</div>
// 		</div>
// 	))

// 	const handleSlideChange = (e: EventObject): void => {
// 		console.log("handleSlideChange", e)
// 	}

// 	const setBtnsVisibility = (e: EventObject): void => {
// 		setShowBtnPrev(!e.isPrevSlideDisabled)
// 		setShowBtnNext(!e.isNextSlideDisabled)
// 	}

// 	return (
// 		<>
// 			<div className={`carrossel-custom ${styles.carrossel}`}>
// 				<AliceCarousel
// 					mouseTracking={true}
// 					items={items}
// 					responsive={responsive}
// 					controlsStrategy="responsive"
// 					animationDuration={500}
// 					infinite={false}
// 					ref={carouselRef}
// 					disableDotsControls={true}
// 					disableButtonsControls={true}
// 					onSlideChange={handleSlideChange}
// 					onSlideChanged={setBtnsVisibility}
// 					onResized={setBtnsVisibility}
// 					onInitialized={setBtnsVisibility}
// 					// paddingLeft={30}
// 					paddingRight={30}
// 					renderKey={items.length}
// 				/>
// 				<div className={styles.buttons}>
// 					<button
// 						type="button"
// 						title="Voltar"
// 						className={`${styles.btn} ${styles.btn__prev} ${showBtnPrev ? styles.show : ""}`}
// 						disabled={!showBtnPrev}
// 						onClick={e => carouselRef.current.slidePrev(e)}>
// 						<Icon iconName="DoubleChevronLeft" />
// 					</button>
// 					<button
// 						type="button"
// 						title="Avançar"
// 						className={`${styles.btn} ${styles.btn__next} ${showBtnNext ? styles.show : ""}`}
// 						disabled={!showBtnNext}
// 						onClick={e => carouselRef.current.slideNext(e)}>
// 						<Icon iconName="DoubleChevronRight" />
// 					</button>
// 				</div>
// 			</div>
// 		</>
// 	)
// }

// export default Carrossel
