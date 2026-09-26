let shoppingItems = [];

function addItem() {

    const name = document.getElementById("itemName").value.trim();
    const category = document.getElementById("category").value;
    const quantity = Number(document.getElementById("quantity").value);
    const price = Number(document.getElementById("price").value);

    if (name === "" || quantity <= 0 || price < 0) {
        alert("Please enter valid item details.");
        return;
    }

    const item = {
        id: Date.now(),
        name: name,
        category: category,
        quantity: quantity,
        price: price,
        purchased: false
    };

    shoppingItems.push(item);

    // Clear input fields
    document.getElementById("itemName").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("price").value = "";

    displayItems();
}


function displayItems() {

    const list = document.getElementById("shoppingList");
    const filter = document.getElementById("filterCategory").value;

    list.innerHTML = "";

    let filteredItems = shoppingItems;

    if (filter !== "All") {
        filteredItems = shoppingItems.filter(
            item => item.category === filter
        );
    }

    filteredItems.forEach(item => {

        const itemDiv = document.createElement("div");

        itemDiv.className = "item";

        if (item.purchased) {
            itemDiv.classList.add("purchased");
        }

        itemDiv.innerHTML = `
            <div class="item-info">

                <input 
                    type="checkbox"
                    ${item.purchased ? "checked" : ""}
                    onchange="togglePurchased(${item.id})"
                >

                <div>
                    <div>
                        <span class="item-name">${item.name}</span>

                        <span class="category">
                            ${item.category}
                        </span>
                    </div>

                    <div class="details">
                        Quantity: ${item.quantity}
                        &nbsp; | &nbsp;
                        ₹${item.price.toFixed(2)} each
                        &nbsp; | &nbsp;
                        Total: ₹${(item.quantity * item.price).toFixed(2)}
                    </div>
                </div>

            </div>

            <button 
                class="delete-btn"
                onclick="deleteItem(${item.id})">
                Delete
            </button>
        `;

        list.appendChild(itemDiv);
    });

    updateBill();
}


function togglePurchased(id) {

    const item = shoppingItems.find(item => item.id === id);

    if (item) {
        item.purchased = !item.purchased;
    }

    displayItems();
}


function deleteItem(id) {

    shoppingItems = shoppingItems.filter(
        item => item.id !== id
    );

    displayItems();
}


function clearPurchased() {

    shoppingItems = shoppingItems.filter(
        item => !item.purchased
    );

    displayItems();
}


function clearAll() {

    if (confirm("Are you sure you want to delete all items?")) {
        shoppingItems = [];
        displayItems();
    }
}


function updateBill() {

    const totalItems = shoppingItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const purchasedItems = shoppingItems.filter(
        item => item.purchased
    ).length;

    const totalBill = shoppingItems.reduce(
        (total, item) =>
            total + (item.quantity * item.price),
        0
    );

    document.getElementById("totalItems").textContent = totalItems;

    document.getElementById("purchasedItems").textContent =
        purchasedItems;

    document.getElementById("totalBill").textContent =
        "₹" + totalBill.toFixed(2);
}


displayItems();