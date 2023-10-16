declare interface IHomeWebPartStrings {
	PropertyPaneDescription: string;
	SaudacaoGroupName: string;

	BasicGroupName: string;
	DescriptionFieldLabel: string;
	AppLocalEnvironmentSharePoint: string;
	AppLocalEnvironmentTeams: string;
	AppLocalEnvironmentOffice: string;
	AppLocalEnvironmentOutlook: string;
	AppSharePointEnvironment: string;
	AppTeamsTabEnvironment: string;
	AppOfficeEnvironment: string;
	AppOutlookEnvironment: string;
}

declare module 'HomeWebPartStrings' {
	const strings: IHomeWebPartStrings;
	export = strings;
}
