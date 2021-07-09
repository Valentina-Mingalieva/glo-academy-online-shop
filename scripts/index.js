const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');
const headerCityButton = document.querySelector('.header__city-button');
const cartListGoods = document.querySelector('.cart__list-goods');
const cartTotalCost = document.querySelector('.cart__total-cost')

let hash = location.hash.substring(1);

const updateLocation = () => {
    const lsLocation = localStorage.getItem('lomoda-location');

    headerCityButton.textContent =
        lsLocation && lsLocation !== 'null' ?
            lsLocation : 'What is your city?';
}

headerCityButton.addEventListener('click', () => {
    const city = prompt('What is your city?');
    if (city !== null) {
        localStorage.setItem('lomoda-location', city);
    } 
    updateLocation();
})   

updateLocation();

const getLocalStorage = () => JSON?.parse(localStorage.getItem('cart-lomoda')) || [];
const setLocalStorage = (data) => localStorage.setItem('cart-lomoda', JSON.stringify(data));

// create cart table
const renderCart = () => {
    cartListGoods.textContent = '';

    const cartItems = getLocalStorage();

    let totalPrice = 0;

    cartItems.forEach((item, i) => {
       
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i+1}</td>
            <td>${item.brand} ${item.name}</td>
            ${item.color ? `<td>${item.color}</td>` : '<td>-</td>'}
            ${item.size ? `<td>${item.size}</td>` : '<td>-</td>'}
            <td>${item.cost} &#8381;</td>
            <td><button class="btn-delete" data-id="${item.id}">&times;</button></td>
        `;
        totalPrice += item.cost;
        cartListGoods.append(tr);
    })
    cartTotalCost.textContent = totalPrice + '  ₽';
}

// removing items from the cart
const deleteItemCart = id => {
    const cartItems = getLocalStorage();
    const newCartItems = cartItems.filter(item => item.id != id);
    setLocalStorage(newCartItems);
}

cartListGoods.addEventListener('click', e => {
    if (e.target.matches('.btn-delete')) {
        deleteItemCart(e.target.dataset.id);
        renderCart();
    }
})

// scroll

const disableScroll = () => {
    const widthScroll = window.innerWidth - document.body.offsetWidth;
    document.body.dbScrollY = window.scrollY;
    document.body.style.cssText = `
        position: fixed;
        top: ${-window.scrollY}px;
        left: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        padding-right: ${widthScroll}px;
    `;
};

const enableScroll = () => {
    document.body.style.cssText = '';
    window.scroll({
        top: document.body.dbScrollY,
    })
}

// modal window


const modalCartOpen = () => {
    cartOverlay.classList.add('cart-overlay-open');
    disableScroll();
    renderCart();
}    

const modalCartClose = () => {
    cartOverlay.classList.remove('cart-overlay-open');
    enableScroll();
}  

// Database query

const getData = async () => {
    const data = await fetch('db.json');

    if (data.ok) {
        return data.json();
    } else {
        throw new Error(`Data not received, error ${data.statusText}`)
    }
}

const getGoods = (callback, prop, value) => {
    getData()
        .then(data => {
            if (value) {
                callback(data.filter(item => item[prop] === value))
            } else {
                callback(data);
            }
        })
        .catch(err => {
            console.error(err)
        });
}

subheaderCart.addEventListener('click', modalCartOpen)

cartOverlay.addEventListener('click', e => {
    const target = e.target;
    if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
        modalCartClose();
    }    
})    

/* if (target.classList.contains('cart__btn-close')) {
        modalCartClose();
} */

// goods category page

try {
    const goodsList = document.querySelector('.goods__list');

    if (!goodsList) {
        throw 'This is not a goods page'
    }

    const goodsTitle = document.querySelector('.goods__title');

    const changeH2Title = () => {
        goodsTitle.textContent = document.querySelector(`[href*='#${hash}']`).textContent;
    }

    const createCard = ({id, preview, cost, brand, name, sizes}) => {
        const li = document.createElement('li');
        li.classList.add('goods__item');
        li.innerHTML = `
        <article class="good">
            <a class="good__link-img" href="card-good.html#${id}">
                <img class="good__img" src="goods-image/${preview}" alt="">
            </a>
            <div class="good__description">
                <p class="good__price">${cost} &#8381;</p>
                <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
                ${sizes ?
                `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>` : ''}
                <a class="good__link" href="card-good.html#${id}">Подробнее</a>
            </div>
        </article>
        `;
        return li;
    };

    const renderGoodsList = data => {
        goodsList.textContent = '';
        /* for (let i = 0; i < data.length; i++) {
            console.log(data[i]);

        } */

        /* for (const item of data) {
            console.log(item);
        } */

        data.forEach((item) => {
            const card = createCard(item);
            goodsList.append(card);
        })
    }

    window.addEventListener('hashchange', () => {
        hash = location.hash.substring(1);
        getGoods(renderGoodsList, 'category', hash);   
        changeH2Title();
    })
    
    changeH2Title();
    getGoods(renderGoodsList, 'category', hash);
    
} catch (err) {
    console.warn(err)
}

// one good page

try {
    if (!document.querySelector('.card-good')) {
        throw 'This is not a card-good page';
    }
    const goodImage = document.querySelector('.card-good__image');;
    const goodBrand = document.querySelector ('.card-good__brand');
    const goodTitle = document.querySelector ('.card-good__title');
    const goodPrice = document.querySelector ('.card-good__price');
    const goodColor = document.querySelector ('.card-good__color');
    const goodSizes = document.querySelector ('.card-good__sizes');
    const goodColorList = document.querySelector ('.card-good__color-list');
    const goodSizesList = document.querySelector('.card-good__sizes-list');
    const goodBuy = document.querySelector('.card-good__buy');
    const goodSelectWrapper = document.querySelectorAll('.card-good__select__wrapper');

    const generateList = data => data.reduce((html, item, index) =>
        html + `<li class='card-good__select-item' data-id='${index}'>${item}</li>`, '');
    
    const renderGoodPage = ([{ id, brand, name, cost, color, sizes, photo }]) => {

        const data = { brand, name, cost, id };

        goodImage.src = `goods-image/${photo}`;
        goodImage.alt = `${brand} ${name}`;
        goodBrand.textContent = brand;
        goodTitle.textContent = name;
        goodPrice.textContent = `${cost} ₽`;
        if (color) {
            goodColor.textContent = color[0];
            goodColor.dataset.id = 0;
            goodColorList.innerHTML = generateList(color);
        } else {
            goodColor.style.display = 'none';
        }
        if (sizes) {
            goodSizes.textContent = sizes[0];
            goodSizes.dataset.id = 0;
            goodSizesList.innerHTML = generateList(sizes);
        } else {
            goodSizes.style.display = 'none';
        }

        if (getLocalStorage().some(item => item.id === id)) {
            goodBuy.classList.add('delete');
            goodBuy.textContent = 'Remove item from the cart';
        }
 
        goodBuy.addEventListener('click', () => {
            if (goodBuy.classList.contains('delete')) {
                deleteItemCart(id);
                goodBuy.classList.remove('delete');
                goodBuy.textContent = 'Add to the cart';
                return;
            };

            if (color) data.color = goodColor.textContent;
            if (sizes) data.size = goodSizes.textContent;

            goodBuy.classList.add('delete');
            goodBuy.textContent = 'Remove item from the cart';

            const cardData = getLocalStorage();
            cardData.push(data);
            setLocalStorage(cardData);
        })
    };

    goodSelectWrapper.forEach(item => {
        item.addEventListener('click', e => {
            const target = e.target;

            if (target.closest('.card-good__select')) {
                target.classList.toggle('card-good__select__open');
            }

            if (target.closest('.card-good__select-item')) {
                const goodSelect = item.querySelector('.card-good__select');
                goodSelect.textContent = target.textContent;
                goodSelect.dataset.id = target.dataset.id;
                goodSelect.classList.remove('card-good__select__open');
            }
        });
    });

    getGoods(renderGoodPage, 'id', hash);
    
} catch (err) {
    console.warn(err);
}