import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IDestaque, IDropdownList } from "../../interfaces";

export interface IHomeProps {
	context: WebPartContext;
	onConfigure: () => void;

	// Saudacao
	saudacaoShowName: string;
	saudacaoFullName: string;
	saudacaoGreetingMessage: string;
	saudacaoTimeBasedMessage: boolean;
	saudacaoText: string;

	// Destaque
	destaqueSelectedPageId: number;
	destaqueSelectedSitePage: boolean;
	destaquePage: IDestaque;

	// Redes Sociais
	redesSociaisListGuid: string;
	redesSociaisColor: string;

	// Minha Mesa
	minhaMesaLists: IDropdownList[];


	isDarkTheme: boolean;
	environmentMessage: string;
	hasTeamsContext: boolean;
	userDisplayName: string;
}
