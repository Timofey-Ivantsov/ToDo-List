const input = document.getElementById('name')
const createBtn = document.getElementById('add')
const list = document.getElementById('list')
const deleteAll = document.getElementById('deleteAll')
const task = document.getElementById('task')

let accept, remove
let index = -1
let notes = [], deals = []
let indexes = []
let noteId = 0
let nt

//localStorage.clear()

function renderDeal(index = deals.length - 1) {
    const deal = deals[index]
    task.insertAdjacentHTML(`beforeend`, getDealTemplate(deal, index))
}

function deleteNote(index)
{
    const lb = document.getElementById(`listBlock${index}`)
    lb.innerHTML = ''
    lb.style.display = 'none'
}

function deleteTask(index)
{
    const getDeal = document.getElementById(`note${index}`)
    getDeal.innerHTML = ''
    getDeal.style.display = 'none'
}

function renderText(index){
    const note = notes[index]
    const lb = document.getElementById(`listBlock${index}`)
    lb.innerHTML = ''
    const liDiv = document.createElement('ul')
    liDiv.setAttribute("id", "list")
    liDiv.innerHTML = getText(note, index)
    lb.appendChild(liDiv)
}

function renderNote(index = notes.length - 1) {
    const note = notes[index]
    const deal = document.getElementById(`note${note.dealId}`)
    const noteDiv = document.createElement('div')
    noteDiv.innerHTML = getNoteTemplate(note, index)
    deal.appendChild(noteDiv)
}

function getDealTemplate(deal, index) {
    return `
    <div id="note${index}" class="deal">
    <p class="note_name">${deal}</p>
    <input id="noteInput${index}" type = "text" class = "name note">
    <div class = "add_remove">
    <button class = "add_note"><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" data-index = "${index}" data-type = "add"><path d="M450-450H200v-60h250v-250h60v250h250v60H510v250h-60v-250Z" data-index = "${index}" data-type = "add"/></svg></button>
    <button class = "remove_note"><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" data-index = "${index}" data-type = "remove"><path d="M200-450v-60h560v60H200Z" data-index = ${index} data-type = "remove"/></svg></button>
    </div>
    </div>
    `
}

function getNoteTemplate(note, index) {
    return `
    <div id = "listBlock${index}" class = "list">
        <ul id = "list">
            <li id = "li${index}">
                <span class = "title str${index}">${note.title} <style>${note.completed ? `.str${index} {text-decoration: line-through}` : ''}</style></span>
                <div class = "buttons">
                    <button id = "accept" class = "accept accept_btn${index}"><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" data-ind = "${index}" data-type = "done"><path d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z" data-ind = "${index}" data-type = "done"/></svg><style>${note.completed ? `.accept_btn${index} {background-color: gray}` : ''}</style></button>
                    <button id = "remove" class = "remove"><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" data-ind = "${index}" data-type = "cancel"><path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" data-ind = "${index}" data-type = "cancel"/></svg></button>
                </div>
            </li>
        </ul>
    </div>`
}

function getText(note, index){
    return `
    li id = "li${index}">
                <span class = "title str${index}">${note.title} <style>${note.completed ? `.str${index} {text-decoration: line-through}` : ''}</style></span>
                <div class = "buttons">
                    <button id = "accept" class = "accept accept_btn${index}"><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" data-ind = "${index}" data-type = "done"><path d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z" data-ind = "${index}" data-type = "done"/></svg><style>${note.completed ? `.accept_btn${index} {background-color: gray}` : ''}</style></button>
                    <button id = "remove" class = "remove"><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" data-ind = "${index}" data-type = "cancel"><path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" data-ind = "${index}" data-type = "cancel"/></svg></button>
                </div>
            </li>`

}

function init() {
    if(localStorage.length > 0) {
        let data = JSON.parse(localStorage.getItem('data'))
        if (data) notes = data
        
        data = JSON.parse(localStorage.getItem('task'))
        if (data) deals = data
     
        for(let i = 0; i < deals.length; ++i) {
            renderDeal(i)
        }
        
        for(let i = 0; i < notes.length; ++i) {
            renderNote(i)
        }
    }
    
    if(deals.length === 0) {
        deleteAll.style.display = 'none'
    }

    createBtn.addEventListener('click', () => {
        if(input.value === '') return
    
        deals.push(input.value)
        renderDeal()

        input.value = ''
        localStorage.setItem('task', JSON.stringify(deals))
        deleteAll.style.display = 'block'
    })
    
    task.addEventListener('click', function(event) {
        let index = event.target.dataset.index
        let type = event.target.dataset.type
        let ind = event.target.dataset.ind
            
        if(index && type === 'add') {
            nt = document.getElementById(`noteInput${index}`).value
            
            if(nt === '') {return}
            
            const newNote = {
                title: nt,
                completed: false,
                dealId: index
            }

            notes.push(newNote)
            renderNote()
            
            localStorage.setItem('data', JSON.stringify(notes))
            nt.value = ''

        }else if(ind && type === 'done'){

            if(notes[ind] === undefined) {return}
            notes[ind].completed = !notes[ind].completed
            localStorage.setItem('data', JSON.stringify(notes))
            renderText(ind)

        }else if(ind && type === 'cancel'){

            let arrayNotes = []
            arrayNotes = JSON.parse(localStorage.getItem('data'))
            arrayNotes.splice(ind, 1)
            localStorage.setItem('data', JSON.stringify(arrayNotes))
            deleteNote(ind)
            
        }else if(index && type === 'remove'){

            let arrayDeals = []
            arrayDeals = JSON.parse(localStorage.getItem('task'))
            arrayDeals.splice(ind, 1)
            localStorage.setItem('task', JSON.stringify(arrayDeals))
            deleteTask(index)
        }
    })

    deleteAll.onclick = function(){
    localStorage.clear()
    location.reload()
    }
}

init()