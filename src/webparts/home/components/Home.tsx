import * as React from "react"
import globalStyles from "../../../Global.module.scss"
import styles from "./Home.module.scss"
import { IHomeProps } from "./IHomeProps"
// import { escape } from "@microsoft/sp-lodash-subset"
import Saudacao from "../../saudacao/components/Saudacao"
import Destaque from "../../destaque/components/Destaque"
import ListaLinks from "../../listaLinks/components/ListaLinks"
import MinhaMesa from "../../minhaMesa/components/MinhaMesa"
import Carrossel from "../../carrossel/components/Carrossel"

const Home: React.FunctionComponent<IHomeProps> = props => {
	const {
		onConfigure,
		context,
		saudacaoShowName,
		saudacaoFullName,
		saudacaoGreetingMessage,
		saudacaoTimeBasedMessage,
		saudacaoText,
		destaquePage,
		destaqueSelectedPageId,
		destaqueSelectedSitePage,
		redesSociaisColor,
		redesSociaisListGuid,
		minhaMesaLists
	} = props

	return (
		<>
			<MinhaMesa context={context} lists={minhaMesaLists} />
			<section className={`${styles.home} ${globalStyles.sectionFull}`}>
				<div>
					<header>
						<a href="#">
							<img src={require("../../../assets/img/logo-bacen.png")} alt="Banco Central do Brasil" />
						</a>
						<div id="midias-sociais">
							<ListaLinks context={context} listGuid={redesSociaisListGuid} color={redesSociaisColor} />
						</div>
					</header>
					<main>
						<div className={`${globalStyles.container}`}>
							<div id="saudacao">
								<Saudacao
									showName={saudacaoShowName}
									fullName={saudacaoFullName}
									greetingMessage={saudacaoGreetingMessage}
									timeBasedMessage={saudacaoTimeBasedMessage}
									text={saudacaoText}
								/>
							</div>
							<div id={globalStyles["destaque-webpart"]}>
								<Destaque
									onConfigure={onConfigure}
									context={context}
									destaque={destaquePage}
									selectedPageId={destaqueSelectedPageId}
									selectedSitePage={destaqueSelectedSitePage}
								/>
							</div>
							<div>
								<Carrossel />
							</div>
						</div>
					</main>
				</div>
			</section>
		</>
	)
}

export default Home
