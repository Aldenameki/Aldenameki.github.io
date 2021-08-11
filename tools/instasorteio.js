class Cliente {
	constructor(Name="", Tag=[], Tags=[]) {
		this.active = true;
		this.name = Name;
		this.tag = Tag;
		this.tags = [];

		if(Tags.length > 0)
			this.tags.push(Tags);
	}

	addTags(Tag) {
		this.tags.push(Tag);
	}

	filterTags() {	//remove tags repetidas


		for(let i=0; i<this.tags.length; i++) {	//passa por cada comentário
			for(let j=0; j<this.tags[i].length; j++) {	//passa por cada tag do comentário
				for(let k=j+1; k<this.tags[i].length; k++) {	//passa pelas tags da frente
					if(this.tags[i][j] == this.tags[i][k]) {	//verifica se a tag i é repetida com as da frente (k)
						this.tags[i].splice(k, 1);	//remove a tag k
						k--;	//volta o k, pois o próximo elemento voltará 1 valor no index
					}
				}


				for(let k=i+1; k<this.tags.length; k++) { //passa por cada comentário da frente
					for(let l=0; l<this.tags[k].length; l++) {	//passa pelas tags dos comentários da frente
						if(this.tags[i][j] == this.tags[k][l]) {	//verifica se a tag i é repetida com as da frente (k)
							this.tags[k].splice(l, 1);	//remove a tag l
							l--;	//volta o l, pois o próximo elemento voltará 1 valor no index
						}
					}
				}
			}


		}
	}

	removeInvalidTicket() {	//remove tags com menos que 2 marcações
		for(let i=0; i<this.tags.length; i++) {
			if(this.tags[i].length < 2) {
				this.tags.splice(i, 1);
				i--;
			}
		}
	}
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function copyText(text) {
	clip = document.createElement('textarea');
	clip.value = text;
	document.body.appendChild(clip);
	clip.select();
	document.execCommand('copy');
	document.body.removeChild(clip);
}

function extractName(file) {
	return file.getElementsByClassName("sqdOP yWX7d     _8A5w5   ZIAjV ")[0].textContent;
}

function extractTags(file) {
	let  holder = file.getElementsByClassName("notranslate");
	let tags = [];

	for(let i=0; i<holder.length; i++)
		tags.push(holder[i].textContent);

	return tags;
}

function extractComments() {
	let commentFiles = document.getElementsByClassName("Mr508 ");
	let comments = [];

	console.log("Comentários lidos: " + commentFiles.length);

	for(let i=0; i<commentFiles.length; i++)
		comments.push(new Cliente(extractName(commentFiles[i]), extractTags(commentFiles[i])));

	return comments;
}

function juntarClientes(comments) {
	let client = [];

	for(let i=0; i<comments.length; i++) {	//passa por cada comentário
		if(comments[i].active) {
			client.push(new Cliente(comments[i].name, null, comments[i].tag));
	
			for(let j=i+1; j<comments.length; j++) {	//mapeia todos os comentários à frente
				if(comments[j].active == true && comments[i].name == comments[j].name) {	//se encontrar o comentário da mesma cliente i
					client[client.length-1].addTags(comments[j].tag)	//junta tag de j em i
					comments[j].active = false;	//deleta comentário j
				}
			}
		}
	}

	return client;
}

function processComments() {
	let comments = extractComments();
	let client = juntarClientes(comments);
	let tickets = [];
	let nameList = "";
	let perfisValidos = 0;

	for(let i=0; i<client.length; i++) {
		client[i].filterTags();
		client[i].removeInvalidTicket();

		for(let j=0; j<client[i].tags.length; j++){
			tickets.push(client[i].name);
		}

		if(client[i].tags.length > 0)
			perfisValidos++;
	}

	for(let i=0; i<tickets.length; i++)
		nameList += tickets[i] + ";";

	console.log(nameList);
	console.log("Comentaram " + client.length + " perfis diferentes.");
	console.log("Foram filtrados " + perfisValidos + " perfis com 1 ou mais cupons válidos.");
	console.log("Foram filtrados " + tickets.length + " cupons válidos.");

	copyText(nameList);
}

function more(limit=300) {
	console.log("Processando... (" + tent + ")");

	tent++;

	moreButton = document.querySelector(".glyphsSpriteCircle_add__outline__24__grey_9");

	if(moreButton == null || tent > limit) {
		processComments();
		return;
	}

	moreButton.click();

	sleep(3000+1000*Math.random()).then(() => {
		more(limite);
	});
}

function start(limit) {
	console.log("Captura de comentários iniciada, aguarde.");

	tent = 0;
	limite = limit/10;
	more(limite);
}

function stopnow() {
	limite = 0;
}