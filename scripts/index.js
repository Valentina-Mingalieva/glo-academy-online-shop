const headerCityButton = document.querySelector('.header__city-button');

/* if (localStorage.getItem('lomoda-location')) {
    headerCityButton.textContent = localStorage.getItem('lomoda-location');
} */

headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'What is your city?';

headerCityButton.addEventListener('click', () => {
    const city = prompt('What is your city?');
    headerCityButton.textContent = city;
    localStorage.setItem('lomoda-location', city);
    
})    

// block scroll

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
