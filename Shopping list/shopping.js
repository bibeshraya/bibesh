const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

//we need an array to hold our state
let items = [];

function handleSubmit(e) {
    e.preventDefault();
    console.log('Submitted!!');
    const name = e.currentTarget.item.value;
    // if its empty, then dont submit it
    if (!name) return;

    const item = {
        name: name,
        id: Date.now(),
        complete: false,
    };
    // push this items into our state
    items.push(item);
    console.log(`There are now ${items.length} in your state`);
    // ckean your form
    e.target.reset();
    // fire a custom event that will tell anyone else who cares that the items have been updated!
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
};

function displayItems() {
    console.log(items);
    const html = items.map(item => {
        return `<li class="shopping-item">
        <input 
            value="${item.id}" 
            type="checkbox"
            ${item.complete && 'checked'}     
        >
        <span class="itemName">${item.name}</span>
        <button 
            aria-label="Remove ${item.name}"
            value="${item.id}"
        >&times;</btton>
        </li>`}).join('');
    list.innerHTML = html;
}

function mirrorToLocalStorage() {
    console.info('Saving items to Localstorage');
    localStorage.setItem('items', JSON.stringify(items));
};

function restoreFromLocalStorage() {
    console.log('sdfsdf')
    console.info('Restoring from LS');
    // pull the items from LS
    const lstItems = JSON.parse(localStorage.getItem('items'));
    console.log(lstItems)
    if (lstItems.length) {
        // items = lstItems;
        // lstItems.forEach(item=> items.push(item));
        // items.push(lstItems[0], lstitems[1]);
        items.push(...lstItems);
        list.dispatchEvent(new CustomEvent('itemsUpdated'));
    }
}

function deleteItem(id) {
    console.log('DELETING ITEM', id);
    // update our items array without this one
    items = items.filter(item => item.id !== id);
    console.log(items);
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function markAsComplete(id) {
    console.log('Marking as complete', id);
    const itemRef =  items.find(item => item.id === id);
    itemRef.complete = !itemRef.complete;
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}


shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);
// event Delegation: we listened for the click on the list <ul> but then delegate the cick over to the button if that is waht was clicked
list.addEventListener('click', function(e) {
    const id = parseInt(e.target.value);
    if (e.target.matches('button')) {
        deleteItem(id);
    }
    if (e.target.matches('input[type="checkbox"]')) {
        markAsComplete(id);
    }
})

const buttons = list.querySelectorAll('button');
console.log(buttons);

buttons.forEach(button => button.addEventListener('click', deleteItem));
restoreFromLocalStorage();