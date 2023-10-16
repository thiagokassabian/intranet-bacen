declare interface ISaudacaoWebPartStrings {
	PropertyPaneDescription: string;
	GroupName: string;

	TimeBasedMessageLabel: string;
	GreetingMessageLabel: string;
	MorningMessageLabel: string;
	EveningMessageLabel: string;
	AfternoonMessageLabel: string;
	ShowNameLabel: string;

	TextLabel: string;
}

declare module 'SaudacaoWebPartStrings' {
  const strings: ISaudacaoWebPartStrings;
  export = strings;
}
