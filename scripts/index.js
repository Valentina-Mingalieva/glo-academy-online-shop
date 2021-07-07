// LESSON 1

const headerCityButton = document.querySelector('.header__city-button');

let hash = location.hash.substring(1);

/* if (localStorage.getItem('lomoda-location')) {
    headerCityButton.textContent = localStorage.getItem('lomoda-location');
} */

headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'What is your city?';

headerCityButton.addEventListener('click', () => {
    const city = prompt('What is your city?');
    headerCityButton.textContent = city;
    localStorage.setItem('lomoda-location', city);
    
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

const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');

const modalCartOpen = () => {
    cartOverlay.classList.add('cart-overlay-open');
    disableScroll();
}    

const modalCartClose = () => {
    cartOverlay.classList.remove('cart-overlay-open');
    enableScroll();
}    

// LESSON 2

// Database query

const getData = async () => {
    const data = await fetch('db.json');

    if (data.ok) {
        return data.json();
    } else {
        throw new Error(`Data not received, error ${data.statusText}`)
    }
}

const getGoods = (callback, value) => {
    getData()
        .then(data => {
            if (value) {
                callback(data.filter(item => item.category === value))
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

try {
    const goodsList = document.querySelector('.goods__list');

    if (!goodsList) {
        throw 'This is not a goods page'
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
        getGoods(renderGoodsList, hash);
        goodsTitle.textContent = navLink.textContent;
    })
    
    getGoods(renderGoodsList, hash);
    
} catch (err) {
    console.warn(err)
}

// change h2 title

/* let goodsTitle = document.querySelector('.goods__title');
const navLink = document.querySelector('.navigation__link');

function changeTitle(e) {
    const target = e.target;
    e.target.textContent = goodsTitle.textContent;
}

navLink.addEventListener('click', changeTitle()); */