const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 

document.getElementById('search').addEventListener('keypress', function(event) {
    if (event.key == "Enter") {
        searchBtn.click();
    }
})

// feature 1: Enter key added on Create Slider Button 

document.getElementById('duration').addEventListener('keypress', function(event) {
    if (event.key == "Enter") {
        sliderBtn.click();
    }
})


//created my own api key
const KEY = '20264095-ec53be0e24674a469c50868dc';

// show images 
const showImages = (images) => {
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
        let div = document.createElement('div');
        div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
        div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
        gallery.appendChild(div);
        toggleSpinner(false);
    })
}

// fetching image from api

const getImages = (query) => {
    const url = `https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&pretty=true`
    toggleSpinner(true);
    fetch(url)
        .then(response => response.json())
        .then(data => showImages(data.hits))
        .catch(error => displayError('Invalid Name!! Please write a proper name and try again!'));
}

// feature 2: Added Spinner on Search Button

const toggleSpinner = (show) => {
    const spinner = document.getElementById('loading-spinner');
    if (show) {
        spinner.classList.remove('d-none');
    } else {
        spinner.classList.add('d-none');
    }
}

// If error generates:

const displayError = error => {
    const errorTag = document.getElementById('error-message');
    errorTag.innerText = error;
    document.getElementById('images').innerHTML = '';
}

let sliders = [];

let slideIndex = 0;

const selectItem = (event, img) => {
    let element = event.target;
    let item = sliders.indexOf(img);

    if (item === -1) {
        element.classList.toggle('added');
        sliders.push(img);

    } else {
        element.classList.toggle('added');
        sliders.pop(img);
    }
}


var timer;

const createSlider = () => {

    // check slider image length

    if (sliders.length < 2) {
        alert('Select at least 2 images.')
        return;
    }

    // crate slider previous next area

    sliderContainer.innerHTML = '';
    const prevNext = document.createElement('div');
    prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

    sliderContainer.appendChild(prevNext);
    document.querySelector('.main').style.display = 'block';
    // hide image area
    imagesArea.style.display = 'none';
    const duration = document.getElementById('duration').value || 1000;
    if (duration < 0) {
        alert("duration cannot be negative, please search again");
        imagesArea.style.display = 'block';
    } else {
        sliders.forEach(slide => {
            let item = document.createElement('div')
            item.className = "slider-item";
            item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
            sliderContainer.appendChild(item)
        })
        changeSlide(0)
        timer = setInterval(function() {
            slideIndex++;
            changeSlide(slideIndex);
        }, duration);
    }
}

// change slider index 
const changeItem = index => {
    changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

    const items = document.querySelectorAll('.slider-item');
    if (index < 0) {
        slideIndex = items.length - 1
        index = slideIndex;
    };

    if (index >= items.length) {
        index = 0;
        slideIndex = 0;
    }

    items.forEach(item => {
        item.style.display = "none"
    })

    items[index].style.display = "block"
}

searchBtn.addEventListener('click', function() {
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    const search = document.getElementById('search');
    getImages(search.value)
    sliders.length = 0;
})

sliderBtn.addEventListener('click', function() {
    createSlider()
})