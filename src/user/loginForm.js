import React, { useRef, useState, useContext } from "react"

import { User } from "../user/context"
import messages from "../user/messages"

const LoginForm = () => {
	const initialState = {
		alert: false,
		processing: false,
		username: null,
		password: null,
		usernameInvalid: false,
		passwordInvalid: false,
	}
	const [state, setState] = useState(initialState)
	const UserContext = useContext(User)
	
	const inputUsernameRef = useRef()
	const inputPasswordRef = useRef()

	const IDs = {
		alert: "login-alert",
		username: "login-user",
		usernameLabel: "login-user-label",
		usernameLabelError: "login-user-label-error",
		password: "login-pass",
		passwordLabel: "login-pass-label",
		passwordLabelError: "login-pass-label-error",
	}

	const changeField = event => {
		let name = event.target.name
		if (!["username", "password"].includes(name)) {
			return
		}

		let value = event.target.value.trim()

		setState({
			...state,
			[name]: value,
		})
	}

	const submitLogin = async event => {
		event.preventDefault()
		event.stopPropagation()

		let { username, password, usernameInvalid, passwordInvalid } = state

		let errorCount = 0

		if (!username) {
			usernameInvalid = messages.username_empty
			errorCount++
		} else {
			usernameInvalid = false
		}

		if (!password) {
			passwordInvalid = messages.password_empty
			errorCount++
		} else {
			passwordInvalid = false
		}

		// Reset errors.
		setState({
			...state,
			usernameInvalid: usernameInvalid,
			passwordInvalid: passwordInvalid,
			alert: errorCount ? messages.login_errors : false,
			processing: errorCount ? false : true,
		})

		if (!username) {
			inputUsernameRef.current.focus()
			return
		}

		if (!password) {
			inputPasswordRef.current.focus()
			return
		}

		await UserContext.login(username, password)
			.then(response => {
				if (!response.user || !response.user.ID) {
					throw new Error(messages.login_error)
				}
			})
			.catch(error => {
				// The response sometimes sends HTML. Ugh.
				let div = document.createElement("div")
				div.innerHTML = error.message
				let errorText = div.textContent || div.innerText || ""

				// @TODO need to setup a "lost password" page.
				
				// Replace "error" prefix.
				errorText = errorText.replace(/^(<strong>)?ERROR:(<\/strong>)?\s/i, "")

				// Set the field errors.
				if (errorText.startsWith("This username is unknown")) {
					inputUsernameRef.current.focus()
					usernameInvalid = errorText
					errorText = messages.login_errors
				} else if (errorText.startsWith("The password you entered")) {
					inputPasswordRef.current.focus()
					passwordInvalid = errorText
					errorText = messages.login_errors
				} else if (errorText.startsWith("NetworkError")) {
					errorText = messages.login_error
				}

				setState({
					...state,
					alert: errorText,
					processing: false,
					usernameInvalid: usernameInvalid,
					passwordInvalid: passwordInvalid,
				})
			})
	}

	const classes = {
		form: "wpc-form wpc-form--login",
		alert: "wpc-form__alert",
		alertHidden: "for-screen-reader",
		label: "wpc-form__label",
		inputWrapper: "wpc-form__inputWrapper",
		input: "wpc-form__input",
		inputError: "wpc-form__input--error",
		submit: "wpc-form__submit",
	}

	if (state.processing) {
		classes.form += " wpc-form--processing"
	}

	const formAttr = {
		action: "",
		name: "login",
		className: classes.form,
	}

	const alertAttr = {
		id: IDs.alert,
		className: classes.alert,
		role: "alert",
	}

	if (!state.alert) {
		alertAttr.className += " " + classes.alertHidden
	}

	const labelUsernameAttr = {
		id: IDs.usernameLabel,
		htmlFor: IDs.username,
		className: classes.label
	}

	const inputUsernameAttr = {
		ref: inputUsernameRef,
		id: IDs.username,
		className: classes.input,
		type: "text",
		name: "username",
		placeholder: "Username",
		required: "required",
		"aria-required": "true",
		"aria-labelledby": `${IDs.usernameLabel} ${IDs.usernameLabelError}`,
		onBlur: event => changeField(event),
		onChange: event => changeField(event),
	}

	if (state.usernameInvalid) {
		inputUsernameAttr["aria-invalid"] = "true"
	}

	const labelPasswordAttr = {
		id: IDs.passwordLabel,
		htmlFor: IDs.username,
		className: classes.label
	}

	const inputPasswordAttr = {
		ref: inputPasswordRef,
		id: IDs.password,
		className: classes.input,
		type: "password",
		name: "password",
		placeholder: "Password",
		required: "required",
		"aria-required": "true",
		"aria-labelledby": `${IDs.passwordLabel} ${IDs.passwordLabelError}`,
		onBlur: event => changeField(event),
		onChange: event => changeField(event),
	}

	if (state.passwordInvalid) {
		inputPasswordAttr["aria-invalid"] = "true"
	}

	const submitAttr = {
		className: classes.submit,
		type: "submit",
		value: "Login",
	}

	return (
		<form {...formAttr} aria-label="Login to WPCampus" onSubmit={event => submitLogin(event)}>
			<p {...alertAttr} aria-live="polite">
				{state.alert}
			</p>
			<label {...labelUsernameAttr}>Username</label>
			<div className={classes.inputWrapper}>
				<input {...inputUsernameAttr} />
				<div id={IDs.usernameLabelError} className={classes.inputError}>
					{state.usernameInvalid}
				</div>
			</div>
			<label {...labelPasswordAttr}>Password:</label>
			<div className={classes.inputWrapper}>
				<input {...inputPasswordAttr} />
				<div id={IDs.passwordLabelError} className={classes.inputError}>
					{state.passwordInvalid}
				</div>
			</div>
			<input {...submitAttr} onClick={event => submitLogin(event)} />
		</form>
	)
}

export default LoginForm
