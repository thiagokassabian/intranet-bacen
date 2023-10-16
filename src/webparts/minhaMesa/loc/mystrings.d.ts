declare interface IMinhaMesaWebPartStrings {
	PropertyPaneDescription: string;
	GroupName: string;

	ListGroupName: string;
	TitleFieldLabel: string;
	ListDropdownLabel: string;
	AddListButtonLabel: string;
	DeleteListButtonLabel: string;
}

declare module 'MinhaMesaWebPartStrings' {
  const strings: IMinhaMesaWebPartStrings;
  export = strings;
}
