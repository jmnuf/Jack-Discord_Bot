const api_link = '../../discordbots-api/jack/';
const listing_node = document.getElementById('serverlist');
let servers;

function make_server_obj(server) {
	if (!listing_node) return;
	let element = document.createElement('a');
	// element.classList.add('container');
	element.classList.add('server-icon-container');
	let icon = document.createElement('img');
	icon.classList.add('server-icon');
	icon.setAttribute('src', server.icon);
	element.innerHTML = `${icon.outerHTML}<i>${server.name}</i>`;
	element.setAttribute('href', server.id ? `./servers/${server.id}` : '#');
	listing_node.appendChild(element);
}

let xhttp = new XMLHttpRequest();

xhttp.open('GET', api_link + 'servers');

function receive_response() {
	if (this.readyState == 4) {
		if (this.status == 200) {
			listing_node.classList.add('servers-container');
			// listing_node.classList.remove('container');
			console.log('received');
			servers = JSON.parse(this.responseText);
			for (let server of servers) {
				make_server_obj(server);
			}
		} else {
			if (listing_node) {
				listing_node.innerHTML = '<h4>Failed to load servers list</h4>';
				listing_node.innerHTML+= `${b}<p>${this.responseText || `Error ${this.status}`}</p>`;
			}
		}
	}
};

xhttp.onreadystatechange = receive_response;

xhttp.send();
