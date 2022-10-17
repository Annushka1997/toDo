"use strict";

const input = document.querySelector("#input");
const root = document.querySelector("#root");
const addBtn = document.querySelector("#addBtn");
const deleteAll = document.querySelector("#deleteAll");
const container = document.querySelector("#container");
const url = "http://localhost:8888/todos";
const save = document.querySelector(".save");

root.addEventListener("submit", function (e) {
	// e.preventDefault();
	const val = input.value.trim();

	if (val !== "") {
		fetch(url, {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify({ name: val })
		});
	}

	this.reset();
});

fetch(url)
.then(data => data.json())
.then(data => {
	data.forEach(todo => {
		container.innerHTML += `
			<div class="listsBlock__item">
				<p>
					<span>${todo.id}</span> ${todo.name}
				</p>
				<button class="remove" data-rm>Remove</button>
				<button class="edit" data-edit>Edit</button>
            </div>
		`;
	});
	return data;
})
.then(data => {
	const removeBtns = document.querySelectorAll("button");
	removeBtns.forEach(rm => {
		rm.addEventListener("click", (e) => {
			if (rm.classList.contains("remove")){
			e.target.parentElement.remove();
			data.forEach(todo => {
			const fakeId = rm.parentElement.firstChild.nextSibling.textContent;
				if (parseInt(fakeId) === todo.id) {
					fetch(`${url}/${todo.id}`, {
						method: "DELETE"
					});
				}
			});
		} 
		else if (rm.classList.contains("edit")) {
			input.value = rm.parentElement.firstChild.nextSibling.textContent.trim().slice(2);
			save.addEventListener("click" , () => {
				data.forEach(todo => {
					const fakeId = rm.parentElement.firstChild.nextSibling.textContent;
						if (parseInt(fakeId) === todo.id) {
							fetch(`${url}/${todo.id}`, {
								method: "PUT",
								headers: {
									"content-type" : "application/json"
								},
								body: JSON.stringify({name: input.value})
							});	
						}	
			});
			});
		}
		});
	});
});

function clearAll () {
	fetch(url)
	.then(data => data.json())
	.then (data => {
		data.forEach(todo => {
			fetch(`${url}/${todo.id}`, {
				method: "DELETE"
			});
		});
	});
}


deleteAll.addEventListener("click", clearAll);

