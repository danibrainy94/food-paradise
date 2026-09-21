// ---------- Page preloader ----------

window.addEventListener('load', function () {
  const loader = document.getElementById('loader')
  const content = document.getElementById('page-container')

  loader.classList.add('fade-out')
  content.classList.add('loaded')

  setTimeout(() => {
    loader.style.display = 'none'
  }, 1000)
})

// ---------- Mobile menu ----------

let crossBtn = document.getElementById('cancel-btn')
let menuBtn = document.getElementById('menu-btn')
let navElements = document.getElementById('links-container')

const showCross = () => {
  menuBtn.style.display = 'none'
  crossBtn.style.display = 'block'
  navElements.classList.remove('hidden')
  navElements.style.display = 'block'
  navElements.classList.add('animation-reveal')
}
const showMenu = () => {
  menuBtn.style.display = 'block'
  crossBtn.style.display = 'none'
  navElements.style.display = 'none'
}

menuBtn.addEventListener('click', showCross)
crossBtn.addEventListener('click', showMenu)

// close the mobile menu after tapping a link
navElements.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  if (window.innerWidth < 768) showMenu()
}))

// subtle shadow on the nav once the page scrolls
const navEl = document.querySelector('nav')
window.addEventListener('scroll', () => {
  navEl.classList.toggle('scrolled', window.scrollY > 10)
}, { passive: true })

// ---------- Slideshow ----------

const slides = document.querySelectorAll('.slide-images')
const dotsContainer = document.getElementById('dots-container')
let currentIndex = 0

slides.forEach((_, i) => {
  const dot = document.createElement('div')
  dot.classList.add('dot')
  if (i === 0) dot.classList.add('active')
  dot.addEventListener('click', () => goToSlide(i))
  dotsContainer.appendChild(dot)
})

const dots = document.querySelectorAll('.dot')

function updateSlide () {
  document.querySelector('.slideshow-wrapper').style.transform = `translateX(-${
    currentIndex * 100
  }%)`
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex))
}

function changeSlide (step) {
  currentIndex = (currentIndex + step + slides.length) % slides.length
  updateSlide()
  resetAutoPlay()
}

function goToSlide (index) {
  currentIndex = index
  updateSlide()
  resetAutoPlay()
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
let autoPlayInterval

function startAutoPlay () {
  if (prefersReducedMotion) return
  autoPlayInterval = setInterval(() => changeSlide(1), 5000)
}

function resetAutoPlay () {
  clearInterval(autoPlayInterval)
  startAutoPlay()
}

startAutoPlay()

// ---------- Products ----------

let productList = []

const initApp = () => {
  fetch('products.json')
    .then(response => response.json())
    .then(data => {
      productList = data
      generateProducts()
      // re-render the sidebar now that product data exists
      // (a cart restored from localStorage was loaded before this fetch resolved)
      cartDisplayToPage()
    })
}

initApp()

let productBox = document.getElementById('items-container')

const categoryLabels = {
  nigerian: 'Nigerian',
  continental: 'Continental',
  shakes: 'Shakes',
  berbecue: 'Barbecue'
}

const categoryCodes = {
  nigerian: 'NIG',
  continental: 'CNT',
  shakes: 'SHK',
  berbecue: 'BBQ'
}

const generateProducts = (product = productList) => {
  if (product.length > 0) {
    product.forEach((prod, i) => {
      let productDiv = document.createElement('div')
      productDiv.classList.add('box')
      productDiv.dataset.id = prod.id
      productDiv.style.setProperty('--i', i % 8)

      productDiv.innerHTML = `
        <div class="product-media">
          <img class="product-img" src="./food-img/${prod.img}" alt="${prod.productName}" loading="lazy">
        </div>
        <div class="card-body">
          <h2 class="box-title">${prod.productName}</h2>
          <p class="product-sub">${categoryLabels[prod.category] || prod.category}</p>
          <div class="card-meta">
            <span class="meta-item"><i class='bx bx-tag'></i> from <b>&#8358;${prod.price.toLocaleString()}</b></span>
            <span class="meta-item"><i class='bx bx-utensil'></i> <b>${categoryCodes[prod.category] || ''}</b></span>
          </div>
          <div class="card-actions">
            <button class="add-btn cart-btn" type="button" aria-label="Add ${prod.productName} to cart">
              <i class='bx bx-cart-plus' aria-hidden='true'></i>
              <span class="btn-text">Add to cart</span>
            </button>
            <button class="heart-btn" type="button" aria-pressed="false" aria-label="Save ${prod.productName} to favorites">
              <i class='bx bx-heart'></i>
            </button>
          </div>
        </div>
      `
      productBox.appendChild(productDiv)
    })
  }
}

// ---------- Category filters ----------

let filterButtons = document.querySelectorAll('.filter-btn')

filterButtons.forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    const category = e.currentTarget.dataset.id

    filterButtons.forEach(b => b.classList.remove('active'))
    btn.classList.add('active')

    const productCategory = productList.filter(function (menuItem) {
      if (menuItem.category === category) {
        return menuItem
      }
    })

    productBox.innerHTML = ''
    if (category === 'all') {
      generateProducts(productList)
    } else {
      generateProducts(productCategory)
    }
  })
})

// ---------- Cart ----------

let cartCounter = document.getElementById('cart-count')
let cartButton = document.getElementsByClassName('bx-cart')
let cartItemsWrapper = document.getElementById('cart-items-wrapper')
let cartContainerBtn = document.querySelector('.cart-container')
let cartItemsContainer = document.querySelector('#cart-items-container')
let cartBackdrop = document.querySelector('.cart-backdrop')
let checkoutBtn = document.querySelector('.checkout')

let cart = []

const saveCart = () => localStorage.setItem('fp-cart', JSON.stringify(cart))

const loadCart = () => {
  try {
    cart = JSON.parse(localStorage.getItem('fp-cart')) || []
  } catch (e) {
    cart = []
  }
}
loadCart()

const cartTotalQty = () => cart.reduce((sum, item) => sum + item.quantity, 0)

const updateCartCount = () => {
  const qty = cartTotalQty()
  cartCounter.textContent = qty
  let totalItems = document.getElementById('total-items')
  if (totalItems) totalItems.textContent = qty
  if (checkoutBtn) {
    checkoutBtn.disabled = qty === 0
  }
}

const openCart = () => {
  cartItemsContainer.classList.add('open')
  document.body.classList.add('cart-open')
  cartItemsContainer.setAttribute('aria-hidden', 'false')
}

const closeCart = () => {
  cartItemsContainer.classList.remove('open')
  document.body.classList.remove('cart-open')
  cartItemsContainer.setAttribute('aria-hidden', 'true')
}

cartContainerBtn.addEventListener('click', openCart)
document.getElementById('close-cart').addEventListener('click', closeCart)
cartBackdrop.addEventListener('click', closeCart)

// Escape closes the cart (and mobile menu)
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeCart()
    if (window.innerWidth < 768) showMenu()
  }
})

// add-to-cart (delegated, also drives fly-to-cart + counter)
productBox.addEventListener('click', e => {
  let btnPosition = e.target.closest('.cart-btn')
  if (!btnPosition) return

  const product_cont = btnPosition.closest('.box')
  if (!product_cont) return

  const product_id = product_cont.dataset.id
  addItemsToCart(product_id)
  flyToCart(product_cont, cartButton[0])
})

// heart / favorites toggle (visual only, per-card state)
productBox.addEventListener('click', e => {
  const heart = e.target.closest('.heart-btn')
  if (!heart) return
  e.stopPropagation()
  heart.classList.toggle('active')
  const icon = heart.querySelector('i')
  icon.classList.toggle('bx-heart')
  icon.classList.toggle('bxs-heart')
  heart.setAttribute('aria-pressed', heart.classList.contains('active'))
})

const addItemsToCart = product_id => {
  let productPositionCart = cart.findIndex(
    value => value.product_id == product_id
  )
  if (cart.length <= 0) {
    cart = [{ product_id: product_id, quantity: 1 }]
  } else if (productPositionCart < 0) {
    cart.push({ product_id: product_id, quantity: 1 })
  } else {
    cart[productPositionCart].quantity = cart[productPositionCart].quantity + 1
  }
  updateCartCount()
  cartDisplayToPage()
}

const cartDisplayToPage = () => {
  saveCart()
  cartItemsWrapper.innerHTML = ''

  if (cart.length === 0) {
    cartItemsWrapper.innerHTML = `
      <div class="cart-empty">
        <i class='bx bx-bowl'></i>
        <p>Your cart is empty</p>
        <span>Something delicious is waiting — start your order!</span>
      </div>`
  }

  cart.forEach((cart_obj, idx) => {
    let presentPosition = productList.findIndex(
      value => value.id == cart_obj.product_id
    )
    let itemsInfo = productList[presentPosition]
    if (itemsInfo) {
      let cartItems = document.createElement('div')
      cartItems.classList.add('cart-items')
      cartItems.innerHTML = `
        <div class="cart-item">
          <img src="./food-img/${itemsInfo.img}" alt="${itemsInfo.productName}" class="cart-img">
          <div>
            <p id="cart-name">${itemsInfo.productName}</p>
            <p id="cart-price">&#8358; ${Number(itemsInfo.price).toLocaleString()}</p>
          </div>
          <div class="cart-buttons-container">
            <button class="cart-btns-left" aria-label="Decrease quantity"><i class='bx bx-minus'></i></button>
            <span>${cart_obj.quantity}</span>
            <button class="cart-btns-right" aria-label="Increase quantity"><i class='bx bx-plus'></i></button>
          </div>
        </div>
      `
      cartItemsWrapper.appendChild(cartItems)
    }
  })

  let total = 0
  cart.forEach(cart_obj => {
    let presentPosition = productList.findIndex(
      value => value.id == cart_obj.product_id
    )
    let itemsInfo = productList[presentPosition]
    if (itemsInfo && !isNaN(itemsInfo.price)) {
      total += Number(itemsInfo.price) * cart_obj.quantity
    }
  })

  let totalPrice = document.getElementById('total-price')
  if (totalPrice) {
    totalPrice.textContent = Number(total).toLocaleString()
  }

  const cartItems = cartItemsWrapper.querySelectorAll('.cart-items')
  cartItems.forEach((item, idx) => {
    const leftBtn = item.querySelector('.cart-btns-left')
    const rightBtn = item.querySelector('.cart-btns-right')

    leftBtn.addEventListener('click', () => {
      if (cart[idx].quantity > 1) {
        cart[idx].quantity--
      } else {
        cart.splice(idx, 1)
      }
      updateCartCount()
      cartDisplayToPage()
    })

    rightBtn.addEventListener('click', () => {
      cart[idx].quantity++
      updateCartCount()
      cartDisplayToPage()
    })
  })

  updateCartCount()
}

// render a cart restored from a previous visit
cartDisplayToPage()

// clear cart
let clearCartBtn = document.getElementById('clear-cart')

clearCartBtn.addEventListener('click', () => {
  cart = []
  updateCartCount()
  cartDisplayToPage()
})

// checkout → open the payment page (cart is persisted in localStorage)
checkoutBtn.addEventListener('click', () => {
  if (checkoutBtn.disabled) return
  saveCart()
  window.location.href = 'payment.html'
})

// ---------- Fly-to-cart animation ----------

function shakeCartIcon () {
  if (!cartIcon) return
  cartIcon.classList.add('shake')
  setTimeout(() => {
    cartIcon.classList.remove('shake')
  }, 500)
}

function flyToCart (itemElement, cartElement) {
  if (prefersReducedMotion || !cartElement) return
  const img = itemElement.querySelector('.product-img').cloneNode()
  const itemRect = itemElement.getBoundingClientRect()
  const cartRect = cartElement.getBoundingClientRect()

  img.style.position = 'fixed'
  img.style.left = itemRect.left + 'px'
  img.style.top = itemRect.top + 'px'
  img.style.width = itemRect.width + 'px'
  img.style.height = itemRect.height + 'px'
  img.style.borderRadius = '16px'
  img.style.transition = 'all 0.45s cubic-bezier(.55,-0.04,.91,.94)'
  img.style.zIndex = 1000
  img.style.pointerEvents = 'none'
  document.body.appendChild(img)

  setTimeout(() => {
    img.style.left = cartRect.left + 'px'
    img.style.top = cartRect.top + 'px'
    img.style.width = '30px'
    img.style.height = '30px'
    img.style.opacity = '0.4'
  }, 10)

  img.addEventListener('transitionend', () => img.remove())

  shakeCartIcon()
}

const cartIcon = document.querySelector('.bx-cart')

// ---------- Chef spotlight ----------

const chefData = [
  {
    img: './food-img/chef1.png',
    chefname: 'Luca Moretti',
    description:
      'Mastery in modern Mediterranean and Italian cuisine, blending tradition with innovation using seasonal, high-quality ingredients',
    nationality: 'Italian',
    speed: 'fast',
    price: 'Expensive'
  },
  {
    img: './food-img/chef3.jpeg',
    chefname: 'Marie Dubois',
    description:
      'Specializes in French and contemporary fusion cuisine using seasonal, locally sourced ingredients to create refined, flavor-rich dishes.',
    nationality: 'French',
    speed: 'optimum',
    price: 'Moderate'
  },
  {
    img: './food-img/chef2.png',
    chefname: 'Carlos Mendez',
    description:
      'Carlos Mendez specializes in blending bold Latin flavors with modern culinary techniques. Carlos brings a global perspective to authentic, ingredient-driven cuisine.',
    nationality: 'Mexican',
    speed: 'fast',
    price: 'Affordable'
  }
]

let chefImage = document.getElementById('chef-img')
let chefName = document.getElementById('chef-name')
let chefDescription = document.getElementById('chef-description')
let chefSpecs = document.getElementById('chef-specs')
let chefDetail = document.getElementById('chef-detail')
let chefFrame = document.getElementById('chef-frame')
let chefStage = document.getElementById('chef-stage')
let chefIndexList = document.getElementById('chef-index')

let cardIndex = 0

// preload every portrait so tab switches never flash
chefData.forEach(chef => {
  const pre = new Image()
  pre.src = chef.img
})

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)

const renderChef = i => {
  const chef = chefData[i]
  chefImage.src = chef.img
  chefImage.alt = `Portrait of ${chef.chefname}`
  chefName.textContent = chef.chefname
  chefDescription.textContent = chef.description
  chefSpecs.innerHTML = `
  <p><i class='bx bx-building-house'></i>${chef.nationality}</p>
  <p><i class='bx bx-timer'></i>${capitalize(chef.speed)}</p>
  <p><i class='bx bx-currency-notes'></i>${chef.price}</p> `
  chefStage.setAttribute('aria-label', `Portrait of ${chef.chefname}`)
}

// build the numbered chef index (one tab per chef)
chefData.forEach((chef, i) => {
  const tab = document.createElement('button')
  tab.type = 'button'
  tab.className = 'chef-tab'
  tab.id = `chef-tab-${i}`
  tab.setAttribute('role', 'tab')
  tab.setAttribute('aria-controls', 'chef-stage')
  tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false')
  tab.tabIndex = i === 0 ? 0 : -1
  tab.innerHTML = `
    <span class="chef-tab-num">0${i + 1}</span>
    <span class="chef-tab-name">${chef.chefname}</span>
    <span class="chef-tab-cuisine">${chef.nationality} cuisine</span>
  `
  tab.addEventListener('click', () => selectChef(i))
  chefIndexList.appendChild(tab)
})

const chefTabs = Array.from(chefIndexList.children)

// tab keyboard model: arrows move, Home/End jump
chefIndexList.addEventListener('keydown', e => {
  const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
  let next = null
  if (e.key in step) {
    next = (cardIndex + step[e.key] + chefData.length) % chefData.length
  } else if (e.key === 'Home') {
    next = 0
  } else if (e.key === 'End') {
    next = chefData.length - 1
  }
  if (next === null) return
  e.preventDefault()
  selectChef(next)
  chefTabs[next].focus()
})

const selectChef = i => {
  const direction = i >= cardIndex ? 1 : -1
  cardIndex = i
  renderChef(i)

  chefTabs.forEach((tab, n) => {
    const active = n === i
    tab.setAttribute('aria-selected', active ? 'true' : 'false')
    tab.tabIndex = active ? 0 : -1
  })

  const animClass = direction === 1 ? 'chef-in-right' : 'chef-in-left'
  ;[chefFrame, chefDetail].forEach(el => {
    el.classList.remove('chef-in-right', 'chef-in-left')
    void el.offsetWidth
    el.classList.add(animClass)
    el.addEventListener('animationend', () => el.classList.remove(animClass), { once: true })
  })
}

renderChef(0)

// ---------- Scroll reveal ----------

const revealSelectors = [
  '.attest-container',
  '.chef-area-container',
  '.testimonials-container',
  '.cta-band'
]

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  revealSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'))
  })
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12 })
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
}
