import * as React from "react"
// import styles from "./Saudacao.module.scss"
import type { ISaudacaoProps } from "./ISaudacaoProps"
// import { escape } from "@microsoft/sp-lodash-subset"
import * as strings from "SaudacaoWebPartStrings"

const Saudacao:React.FunctionComponent<ISaudacaoProps> = props => {
	const { showName, fullName, greetingMessage, timeBasedMessage, text } = props

	let message: string = greetingMessage
	if (timeBasedMessage) {
		const today: Date = new Date()
		const hours: number = today.getHours()
		if (hours >= 5 && hours < 12) message = strings.MorningMessageLabel
		else if (hours >= 12 && hours < 18) message = strings.AfternoonMessageLabel
		else message = strings.EveningMessageLabel
	}

	let name = ""
	switch (showName) {
		case "full":
			name = fullName
			break

		case "first":
			name = fullName.split(" ")[0]
			break
	}

	return (
		<div>
			<div className="saudacao-text">
				{message}, <strong>{name}</strong>
			</div>
			{text && <div className="">{text}</div>}
		</div>
	)
}

export default Saudacao
