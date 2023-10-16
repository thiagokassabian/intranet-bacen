import * as React from "react"
import { useEffect, useState } from "react"
import styles from "./ListaLinks.module.scss"
import { IListaLinksProps } from "./IListaLinksProps"
import { getSP } from "../../pnpjsConfig"
import { SPFI } from "@pnp/sp"
import { IListaLinkItem } from "../../interfaces"
import parse from "html-react-parser"
import { TooltipHost, ITooltipHostStyles } from "@fluentui/react/lib/Tooltip"
import styled from "styled-components"
// import { escape } from '@microsoft/sp-lodash-subset';

const calloutProps = { gapSpace: 0 }
const hostStyles: Partial<ITooltipHostStyles> = { root: { display: "inline-block" } }

const StyledLink = styled.a<{ $color?: string }>`
	color: ${props => (props.$color ? props.$color + "!important" : null)};
	&:hover {
		color: ${props => (props.$color ? props.$color + "!important" : null)};
		filter: ${props => (props.$color ? "brightness(0.7)" : null)};
	}
`

const ListaLinks: React.FunctionComponent<IListaLinksProps> = props => {
	const { context, listGuid, color } = props
	const [list, setList] = useState<IListaLinkItem[]>()
	const sp: SPFI = getSP(context)

	useEffect(() => {
		if (listGuid) {
			const getPage = async (): Promise<IListaLinkItem[]> => await sp.web.lists.getById(listGuid.toString()).items()
			getPage()
				.then(listItems => {
					const sortedListItems = [...listItems.sort((a, b) => a.Ordem - b.Ordem)].map(item => ({
						...item,
						Imagem: JSON.parse(item.Imagem.toString())
					}))
					setList(sortedListItems)
				})
				.catch(console.log)
		}
	}, [listGuid])

	return (
		<div className={styles.listaLinks}>
			<ul>
				{list?.map(
					(item, index) =>
						!item.Ocultar && (
							<li key={index}>
								<TooltipHost content={item.Title} id={`listalinks-tooltip-${index}`} calloutProps={calloutProps} styles={hostStyles}>
									<StyledLink $color={color} href={item.Url.Url} aria-label={item.Title}>
										{item.SVG && parse(item.SVG)}
										{!item.SVG && item.Imagem && <img src={item.Imagem.serverRelativeUrl} alt={item.Title} />}
									</StyledLink>
								</TooltipHost>
							</li>
						)
				)}
			</ul>
		</div>
	)
}
export default ListaLinks
