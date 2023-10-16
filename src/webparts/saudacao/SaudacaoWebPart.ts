import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
	PropertyPaneTextField,
	type IPropertyPaneConfiguration,
	PropertyPaneToggle,
	PropertyPaneChoiceGroup
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SaudacaoWebPartStrings';
import Saudacao from './components/Saudacao';
import { ISaudacaoProps } from './components/ISaudacaoProps';

export interface ISaudacaoWebPartProps {
	showName: string;
	greetingMessage: string;
	timeBasedMessage: boolean;
	text: string;
}

export default class SaudacaoWebPart extends BaseClientSideWebPart<ISaudacaoWebPartProps> {

	public render(): void {
		const element: React.ReactElement<ISaudacaoProps> = React.createElement(
			Saudacao,
			{
				showName: this.properties.showName,
				fullName: this.context.pageContext.user.displayName,
				greetingMessage: this.properties.greetingMessage,
				timeBasedMessage: this.properties.timeBasedMessage,
				text: this.properties.text
			}
		);

		ReactDom.render(element, this.domElement);
	}

	protected onDispose(): void {
		ReactDom.unmountComponentAtNode(this.domElement);
	}

	protected get dataVersion(): Version {
		return Version.parse('1.0');
	}

	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
		const messageFields = [];

		if (!this.properties.timeBasedMessage) {
			messageFields.push(PropertyPaneTextField("greetingMessage", {
				label: strings.GreetingMessageLabel
			}));
		}

		return {
			pages: [
				{
					header: {
						description: strings.PropertyPaneDescription
					},
					groups: [
						{
							groupFields: [
								PropertyPaneToggle('timeBasedMessage', {
									label: strings.TimeBasedMessageLabel,
									checked: true
								}),
								...messageFields,
								PropertyPaneChoiceGroup('showName', {
									label: strings.ShowNameLabel,
									options: [
										{ key: "full", text: "Nome completo", checked: true },
										{ key: "first", text: "Primeiro nome" },
										{ key: "none", text: "Sem nome" }
									]
								}),
								PropertyPaneTextField('text', {
									label: strings.TextLabel
								})
							]
						}
					]
				}
			]
		};
	}
}
