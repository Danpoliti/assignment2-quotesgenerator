document.addEventListener("DOMContentLoaded", function () {
	console.log(`Ready`)

	// storage html elements 
	const formCreateQuote = document.querySelector(`#form-CreateQuote`)
	const result = document.querySelector(`#result`)
	const generateBtn = document.querySelector(`.generateBtn`)
	const createyoursBtn = document.querySelector(`.createyoursBtn`)
	const saveQuoteBtn = document.querySelector(`#saveQuoteBtn`)
	const clearForm = document.querySelector(`#clearForm`)
	const spanQtyResults = document.querySelector(`#spanQtyResults`)
	const detailsDrop = document.querySelector(`.detailsDrop`)
	const subcontainer = document.querySelector(`#subcontainer`)
	// ======================DANIEL UPDATES STARTS=============================================
	const containerSignUp = document.querySelector(`#containerSignUp`)
	const containerSignIn = document.querySelector(`#containerSignIn`)
	// ======================DANIEL UPDATES ENDS=============================================

	const openHistoContainer = document.querySelector(`#openHistoContainer`)
	const userloginsection = document.querySelector(`#userloginsection`)
	const mainHeader = document.querySelector(`#mainHeader`)
	const yourname = document.querySelector(`.yourname`)

	// array to storage saved quotes
	const quotes = [
	]


	//list of language supported
	const languages = [
		{ value: 'en', lan: 'English' },
		{ value: 'es', lan: 'Spanish' },
		{ value: 'pt', lan: 'Portuguese' },
		{ value: 'it', lan: 'Italian' },
		{ value: 'de', lan: 'German' },
		{ value: 'fr', lan: 'French' },
		{ value: 'cs', lan: 'Czech' },
		{ value: 'sk', lan: 'Slovak' },
		{ value: 'pl', lan: 'Polish' },
		{ value: 'hu', lan: 'Hungarian' },
		{ value: 'ru', lan: 'Russian' }
	]


	//get the language selected
	const getSourceLanguge = function (event) {
		console.log(event.target.value)
		let language = event.target.value
		let lanparameter = `?language_code=${language}`
		console.log(lanparameter)
	}

	// list the language supported to generate a quote
	function listLangSupported() {
		let langTable = document.querySelector(`#lang-quote`)
		languages.map(({ value, lan }) => {
			let language = document.createElement(`option`)
			language.value = value
			language.innerHTML = lan
			langTable.appendChild(language)
		})
	}


	//  GET random quotes 
	function quoteAPI() {

		let languageActive = true
		enableSave()
		displayResult()
		enableDisableLanguage(languageActive)
		const langQuote = document.querySelector(`#lang-quote`)
		let langparameter = `random/?language_code=${langQuote.value}`

		fetch(`https://quotes15.p.rapidapi.com/quotes/${langparameter}`, {
			"method": "GET",
			"headers": {
				"x-rapidapi-key": "0b168600abmsh79f9a6cdaf4fc2ep120417jsn341f4e4f7d29",
				"x-rapidapi-host": "quotes15.p.rapidapi.com"
			}
		})
			.then((response) => response.json())
			.then(response => {
				displayRandomQuote(response.content, response.originator.name)
			})
			.catch(err => {
				console.error(err)
			})
	}

	//  display random quotes 
	function displayRandomQuote(content, name) {
		hideWelcome()
		document.querySelector(`#quoteText`).classList.remove(`hide`)
		document.querySelector(`#insertQuote`).innerHTML = content
		document.querySelector(`.q-open`).innerHTML = `"`
		document.querySelector(`.q-close`).innerHTML = `"`
		document.querySelector(`.cite`).innerHTML = name
	}


	//  display the section of the result of random quotes
	function displayResult() {
		formCreateQuote.classList.add(`hide`)
		formCreateQuote.classList.remove(`form-CreateQuote`)
		result.classList.remove(`hide`)
		result.classList.add(`result`)
	}


	//  display form to create own quote
	function displayForm() {
		let languageActive = false
		enableSave()
		clearResult()
		formCreateQuote.classList.remove(`hide`)
		formCreateQuote.classList.add(`form-CreateQuote`)
		result.classList.add(`hide`)
		result.classList.remove(`result`)
		enableDisableLanguage(languageActive)
	}

	//  save quotes 
	function saveQuote() {
		document.querySelector(`#tooltipSaveBtn`).style.display = "none"
		document.querySelector(`.tooltipSpan`).style.opacity = 0
		// set variables for the quote text and author 
		let authorName = ""
		let contentQuote = ""
		// if the form is hide, assign the random quote information inot the variables
		if (formCreateQuote.classList.contains(`hide`)) {
			authorName = document.querySelector(`.cite`).innerHTML
			contentQuote = document.querySelector(`#insertQuote`).innerHTML
			// else, assign the information in the form into the variables
		} else {
			authorName = document.querySelector(`.yourname`).value
			contentQuote = document.querySelector(`.yourtext`).value
		}

		authorName = authorName.charAt(0).toUpperCase() + authorName.slice(1)

		// if the variables are not empty save variables into data
		if (contentQuote.trim() != "" && authorName.trim() != "") {
			let _data = {
				author: authorName,
				quote: contentQuote,
			}


			// submit the data using POST method
			fetch('https://reqres.in/api/users', {
				method: "POST",
				//  convert saved data to a JSON string
				body: JSON.stringify(_data),
				headers: { "Content-type": "application/json; charset=UTF-8" }
			})
				.then(response => response.json())
				.then(response => {
					console.log(`------------`)
					console.log(response)
					//push the data into the array of saved quotes  
					quotes.push({
						id: parseInt(response.id),
						author: response.author,
						quote: response.quote,
					})
					console.log(`saved`)

					// call funtion to display the saved quotes
					LoadListQuote()

					// show and hide message of saved quote
					document.querySelector(`#alert`).style.display = "flex"
					hideSavedAlert()
				})
				.catch(err => console.log(err))

			hideAlertFieldEmpty()
			document.querySelector(`#orderBy`).disabled = false
			hideEmpty()
		}
		// else, prompt to enter information
		else {
			document.querySelector(`.yourtext`).classList.add(`alertFieldEmpty`)
			document.querySelector(`.yourname`).classList.add(`alertFieldEmpty`)

			if (contentQuote.trim() == "") {
				document.querySelector(`.yourtext`).value = ``
			}

			if (authorName.trim() == "") {
				document.querySelector(`.yourname`).value = ``
			}
		}


	}

	//  load the list of quotes saved
	function LoadListQuote() {

		// sort the saved quotes
		let sort = document.querySelector(`#orderBy`).value
		quotes.sort(function (a, b) {
			let valueA
			let valueB

			if (sort == "id") {
				valueA = a.id
				valueB = b.id
			}
			else {
				valueA = a.author
				valueB = b.author
			}

			if (valueA > valueB) {
				return 1
			}
			if (valueA < valueB) {
				return -1
			}
			return 0
		})

		let result = 0
		// populate the result of saved quotes
		/* container to display history of saved quotes  */
		const quoteTable = document.querySelector(`.historicalResult`)
		quoteTable.innerHTML = ``
		quotes.map(({ id, author, quote }) => {
			let content = ``
			console.log(id, author, quote.substring(0, 10))

			/* container of the single quote saved  */
			const historyItem = document.createElement(`div`)
			historyItem.classList.add(`historyItem`)
			/* header of the item saved  */
			const historyItemHeader = document.createElement(`header`)
			historyItemHeader.classList.add(`historyItem-header`)
			const quoteID = document.createElement(`p`)
			quoteID.classList.add(`quoteID`)
			quoteID.innerHTML = `ID: ${id}`
			quoteID.addEventListener(`click`, function () { showHistoItem(id, author, quote) })
			historyItemHeader.appendChild(quoteID)
			const historyItemBtns = document.createElement(`div`)
			/* button to see quote saved  */
			const seeRowQuote = document.createElement(`button`)
			seeRowQuote.classList.add(`seeRowQuote`)
			seeRowQuote.id = `seeRowQuote`
			seeRowQuote.addEventListener(`click`, function () { showHistoItem(id, author, quote) })
			/* button to delete quote saved  */
			const deleteRowQuote = document.createElement(`button`)
			deleteRowQuote.classList.add(`deleteRowQuote`)
			deleteRowQuote.id = `deleteRowQuote`
			deleteRowQuote.addEventListener(`click`, function () { deleQuote(`${id}`) })
			/* footer of the item saved  */
			const historyItemFooter = document.createElement(`footer`)
			historyItemFooter.classList.add(`historyItem-footer`)
			historyItemFooter.addEventListener(`click`, function () { showHistoItem(id, author, quote) })
			historyItemFooter.innerHTML = `
			<p class="quoteRowTxt">${quote.substring(0, 60)} ...</p>
			<p class="quoteRowAuthor"><i>- ${author}</i></p>
			`
			// append  html elements created
			historyItem.appendChild(historyItemHeader)
			historyItemHeader.appendChild(historyItemBtns)
			historyItemBtns.appendChild(seeRowQuote)
			historyItemBtns.appendChild(deleteRowQuote)
			historyItem.appendChild(historyItemFooter)
			quoteTable.appendChild(historyItem)

			result++

		})
		// display the number of elements in the result
		spanQtyResults.innerHTML = `${result} Results`
		console.log(`loaded saved elements`)
	}

	//  see a single saved quote
	function showHistoItem(id, author, quote) {
		let languageActive = false
		enableDisableLanguage(languageActive)
		displayResult()
		disableSave()
		clearCuoteForm()
		hideWelcome()

		// if the quote section is hiden, close the history section
		if (document.querySelector(`#quote-stion`).classList.contains(`hide`)) {
			closeHisto()
		}

		generateBtn.classList.remove(`btnActive`)
		generateBtn.classList.add(`btnInactive`)
		createyoursBtn.classList.remove(`btnActive`)
		createyoursBtn.classList.add(`btnInactive`)

		// display the content of the saved quote  
		document.querySelector(`#quoteText`).classList.remove(`hide`)
		document.querySelector(`#insertQuote`).innerHTML = quote
		document.querySelector(`.q-open`).innerHTML = `"`
		document.querySelector(`.q-close`).innerHTML = `"`
		document.querySelector(`.cite`).innerHTML = author

	}

	//  delete a single saved quote
	function deleQuote(id) {

		notifyEmpy()
		//  get the  target's index
		let index = quotes.findIndex(function (o) {
			return o.id === id
		})

		// remove 1 element at the target's index
		console.log(index)
		quotes.splice(index, 1)
		LoadListQuote()
		console.log(`quote to delete`, id)
	}

	//  hide message of saved quote
	function hideSavedAlert() {
		setTimeout(function () {
			document.querySelector(`#alert`).style.display = "none"
			document.querySelector(`.tooltipSpan`).style.opacity = 1
		}, 700)
	}


	// display message when history of saved quotes is empty
	function notifyEmpy() {
		const emptyNotification = document.querySelector(`#itsEmpty`)

		if (quotes.length <= 1) {
			emptyNotification.classList.remove(`hide`)
			emptyNotification.classList.add(`itsEmpty`)
			document.querySelector(`#orderBy`).disabled = true
		}
	}

	// hide message about history of saved quotes is empty
	function hideEmpty() {
		const emptyNotification = document.querySelector(`#itsEmpty`)
		emptyNotification.classList.add(`hide`)
		emptyNotification.classList.remove(`itsEmpty`)
	}

	// enable save button
	function enableSave() {
		document.querySelector(`#saveQuoteBtn`).disabled = false
	}

	// disable save button
	function disableSave() {
		document.querySelector(`#saveQuoteBtn`).disabled = true
	}

	// enable and disable Language selector
	function enableDisableLanguage(languageActive) {

		const langQuote = document.querySelector(`#lang-quote`)
		if (languageActive) {
			langQuote.disabled = false
		} else {
			langQuote.disabled = true
		}
	}


	//  open history section
	function openHisto() {

		const labelHisto = document.querySelector(`#histolabel`)
		labelHisto.classList.add(`hide`)
		labelHisto.classList.remove(`histolabel`)

		const openHistoBtn = document.querySelector(`#openHistoBtn`)
		openHistoBtn.classList.add(`hide`)
		openHistoBtn.classList.remove(`openHistoBtn`)

		const quoteStion = document.querySelector(`#quote-stion`)
		quoteStion.classList.add(`hide`)
		quoteStion.classList.remove(`dispGrid`)

		const histoStion = document.querySelector(`#histo-stion`)
		histoStion.classList.remove(`hide`)
		histoStion.classList.add(`dispGrid`)
	}

	//  close history section
	function closeHisto() {

		const labelHisto = document.querySelector(`#histolabel`)
		labelHisto.classList.remove(`hide`)
		labelHisto.classList.add(`histolabel`)

		const openHistoBtn = document.querySelector(`#openHistoBtn`)
		openHistoBtn.classList.remove(`hide`)
		openHistoBtn.classList.add(`openHistoBtn`)

		const quoteStion = document.querySelector(`#quote-stion`)
		quoteStion.classList.remove(`hide`)
		quoteStion.classList.add(`dispGrid`)

		const histoStion = document.querySelector(`#histo-stion`)
		histoStion.classList.add(`hide`)
		histoStion.classList.remove(`dispGrid`)
	}


	//  clear the form fields
	function clearCuoteForm() {
		document.querySelector(`.yourtext`).value = ``
		document.querySelector(`.yourname`).value = ``
		hideAlertFieldEmpty()
	}
	//   clear the result of random quotes 
	function clearResult() {
		document.querySelector(`#insertQuote`).innerHTML = ``
		document.querySelector(`.q-open`).innerHTML = ``
		document.querySelector(`.q-close`).innerHTML = ``
		document.querySelector(`.cite`).innerHTML = ``
	}

	//  display tooltip of the buttons
	function displayBtnTooltip(btn) {
		if (btn == saveQuoteBtn) {
			document.querySelector(`#tooltipSaveBtn`).style.display = "flex"
		} else if (btn == createyoursBtn) {
			document.querySelector(`#tooltipMakeBtn`).style.display = "flex"
		}
		else if (btn == clearForm) {
			document.querySelector(`#tooltipClearForm`).style.display = "flex"

		} else {
			document.querySelector(`#tooltipGetBtn`).style.display = "flex"
		}
		timerBtnTooltip(btn)
	}

	//  timer to hide tooltip of the buttons
	function timerBtnTooltip(btn) {
		timing = setTimeout(function () { hideBtnTooltip(btn) }, 2000)
	}

	//  hide the tooltip of the buttos
	function hideBtnTooltip(btn) {
		if (btn == saveQuoteBtn) {
			document.querySelector(`#tooltipSaveBtn`).style.display = "none"
		} else if (btn == createyoursBtn) {
			document.querySelector(`#tooltipMakeBtn`).style.display = "none"
		}
		else if (btn == clearForm) {
			document.querySelector(`#tooltipClearForm`).style.display = "none"
		} else {
			document.querySelector(`#tooltipGetBtn`).style.display = "none"
		}
	}


	// Set a background when the buttons are active
	function setBGbutton(buttonA, buttonB) {

		buttonA.classList.add(`btnActive`)
		buttonA.classList.remove(`btnInactive`)
		buttonB.classList.add(`btnInactive`)
		buttonB.classList.remove(`btnActive`)
	}

	//  hide welcoming message
	function hideWelcome() {
		document.querySelector(`#welcome`).classList.add(`hide`)
	}

	//  hide message when form fields are empty 
	function hideAlertFieldEmpty() {
		document.querySelector(`.yourtext`).classList.remove(`alertFieldEmpty`)
		document.querySelector(`.yourname`).classList.remove(`alertFieldEmpty`)
	}

	//  display sing out section
	function toggleSignout() {
		detailsDrop.classList.toggle(`flexx`)
		detailsDrop.classList.toggle(`hide`)
	}


	window.addEventListener('click', function (e) {
		if (detailsDrop.classList.contains(`flexx`)) {
			if (!(document.querySelector('.detailsDrop').contains(e.target))
				&& !(document.querySelector('.userIcon').contains(e.target))) {
				toggleSignout()
			}
		}
	})

	// display sign in and sign out section
	// hide quote and history section
	function displaysignUserSection() {
		console.log(`sign out`)
		subcontainer.classList.add(`hide`)
		openHistoContainer.classList.add(`hide`)
		mainHeader.classList.add(`hide`)
		userloginsection.classList.remove(`hide`)

		subcontainer.classList.remove(`subcontainer`)
		openHistoContainer.classList.remove(`openHistoContainer`)
		mainHeader.classList.remove(`mainHeader`)
		userloginsection.classList.add(`userloginsection`)

	}

	// ======================DANIEL UPDATES=============================================

	// Hide Login section and display Sign Up section
	function displaysignUpSection() {
		containerSignUp.classList.remove(`hide`)
		containerSignIn.classList.add(`hide`)

		containerSignIn.classList.remove(`containerSignIn`)
		containerSignUp.classList.add(`containerSignUp`)
	}
	// ======================DANIEL UPDATES=============================================

	// Hide Sign Up section and display Login section
	function hidesignUpSection() {
		containerSignIn.classList.remove(`hide`)
		containerSignUp.classList.add(`hide`)

		containerSignUp.classList.remove(`containerSignUp`)
		containerSignIn.classList.add(`containerSignIn`)

		document.getElementById('formSignUp').reset();
	}

	// ======================DANIEL UPDATES=============================================

	// Create new account using Sign Up form
	function createAccount(e) {
		e.preventDefault();

		const firstName = document.getElementById('firstName').value;
		const lastName = document.getElementById('lastName').value;
		const email = document.getElementById('email').value;
		const userName = document.getElementById('userName').value;
		const password = document.getElementById('password').value;

		if (firstName.trim() != "" && lastName.trim() != "" && email.trim() != "" && userName.trim() != "" && password.trim() != "") {
			let accountData = {
				firstName: firstName,
				lastName: lastName,
				Email: email,
				Username: userName,
				Password: password
			}

			console.log(`First Name: ${firstName}`)
			console.log(`Last Name: ${lastName}`)
			console.log(`Email: ${email}`)
			console.log(`Username: ${userName}`)
			console.log(`Password: ${password}`)
			// submit the data using POST method

			console.log(`Account created successfully!`)

			hidesignUpSection();

			document.querySelector('.accCreate-alert').style.display = 'block';

			//Hide alert after 3 seconds
			setTimeout(function () {
				document.querySelector('.accCreate-alert').style.display = 'none';
			}, 3000);

		} else {
			document.querySelector(`.firstname`).classList.add(`alertFieldEmpty`)
			document.querySelector(`.lastname`).classList.add(`alertFieldEmpty`)
			document.querySelector(`.email`).classList.add(`alertFieldEmpty`)
			document.querySelector(`#userName`).classList.add(`alertFieldEmpty`)
			document.querySelector(`#password`).classList.add(`alertFieldEmpty`)

			setTimeout(function () {
				document.querySelector(`.firstname`).classList.remove(`alertFieldEmpty`)
				document.querySelector(`.lastname`).classList.remove(`alertFieldEmpty`)
				document.querySelector(`.email`).classList.remove(`alertFieldEmpty`)
				document.querySelector(`#userName`).classList.remove(`alertFieldEmpty`)
				document.querySelector(`#password`).classList.remove(`alertFieldEmpty`)
			}, 3000);

		}




		//save message
		// saveData(firstName, lastName, email, userName, password);

		//show alert
		// const accCreateAlert = document.querySelector('.accCreate-alert');




	}
// ===================================================================================



	// hide sign in and sign out section
	// display quote and history section
	function hidesignUserSection() {
		subcontainer.classList.remove(`hide`)
		openHistoContainer.classList.remove(`hide`)
		mainHeader.classList.remove(`hide`)
		userloginsection.classList.add(`hide`)

		subcontainer.classList.add(`subcontainer`)
		openHistoContainer.classList.add(`openHistoContainer`)
		mainHeader.classList.add(`mainHeader`)
		userloginsection.classList.remove(`userloginsection`)
	}

	// make enter key work as  "save quote" button
	yourname.addEventListener("keydown", function (event) {
		if (event.keyCode == 13) {
			event.preventDefault();
			saveQuote()
		}
	})


	// call functions through events
	generateBtn.addEventListener(`click`, quoteAPI)
	generateBtn.addEventListener(`click`, clearCuoteForm)
	createyoursBtn.addEventListener(`click`, displayForm)
	generateBtn.addEventListener(`click`, function () { setBGbutton(generateBtn, createyoursBtn) })
	createyoursBtn.addEventListener(`click`, function () { setBGbutton(createyoursBtn, generateBtn) })
	document.querySelector(`#saveQuoteBtn`).addEventListener(`click`, saveQuote)
	document.querySelector(`#orderBy`).addEventListener(`change`, LoadListQuote)
	document.querySelector(`#openHistoBtn`).addEventListener(`click`, openHisto)
	document.querySelector(`#closeHistoBtn`).addEventListener(`click`, closeHisto)
	generateBtn.addEventListener(`mouseover`, function () { displayBtnTooltip(generateBtn) })
	createyoursBtn.addEventListener(`mouseover`, function () { displayBtnTooltip(createyoursBtn) })
	saveQuoteBtn.addEventListener(`mouseover`, function () { displayBtnTooltip(saveQuoteBtn) })
	clearForm.addEventListener(`mouseover`, function () { displayBtnTooltip(clearForm) })
	clearForm.addEventListener(`click`, clearCuoteForm)
	generateBtn.addEventListener(`mouseout`, function () { hideBtnTooltip(generateBtn) })
	createyoursBtn.addEventListener(`mouseout`, function () { hideBtnTooltip(createyoursBtn) })
	saveQuoteBtn.addEventListener(`mouseout`, function () { hideBtnTooltip(saveQuoteBtn) })
	clearForm.addEventListener(`mouseout`, function () { hideBtnTooltip(clearForm) })
	document.querySelector(`.userIcon`).addEventListener(`click`, toggleSignout)
	document.querySelector(`.signOut`).addEventListener(`click`, displaysignUserSection)
	document.querySelector(`.signIn`).addEventListener(`click`, hidesignUserSection)
	// ======================DANIEL UPDATES=============================================

	document.querySelector(`.signUp`).addEventListener(`click`, displaysignUpSection)
	document.querySelector(`#cancel`).addEventListener(`click`, hidesignUpSection)
	document.querySelector(`.createAcc`).addEventListener(`click`, createAccount)


	// call  list the languages suported 
	listLangSupported()

})