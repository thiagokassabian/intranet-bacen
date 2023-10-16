declare interface IDestaqueWebPartStrings {
	PropertyPaneDescription: string;

	GroupName: string;

	TitleFieldLabel: string;
	TextFieldLabel: string;
	TagFieldLabel: string;
	FilePickerFieldLabel: string;
	FilePickerButtonLabel: string;
	UrlFieldLabel: string;
	SelectedPageFieldLabel: string;
	IsSitePagesToggleLabel: string;
}

declare module 'DestaqueWebPartStrings' {
	const strings: IDestaqueWebPartStrings;
	export = strings;
}
