import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin';
import moment from 'moment';


let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');

//Update cart
function updateCart(pizza) {
   axios.post('/update-cart', pizza).then(res =>{
    
        //Cart counter
        cartCounter.innerText = res.data.totalQty

        //Success & Error messages pop up
        new Noty({
            type: "success",
            timeout: 1000,
            progressBar: false,
            closeWith: ['click'],
            text: "Item added to cart!"
          }).show();
    }).catch(err =>{

        //Success & Error messages pop up
        new Noty({
            type: "error",
            timeout: 1000,
            progressBar: false,
            closeWith: ['click'],
            text: "Something went wrong"
          }).show();
    });
}

//Add to cart
addToCart.forEach(function(btn){
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza);
    });

});

//Remove alert message after 2 seconds
const alertMsg = document.querySelector('#success-alert');

//If alert message present
if(alertMsg){
    setTimeout(() => {
        alertMsg.remove();
    }, 2000);
}

initAdmin();

//Change order status
//Get statuses
let statuses = document.querySelectorAll('.status-line');

//Get order details
let hiddenInput = document.querySelector('#hiddenInput');
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);

//Create time element
let time= document.createElement('small');


function updateStatus(order){
    let stepCompleted = true;

    statuses.forEach((status) =>{
        let dataProp = status.dataset.status

        //Update status
        if(stepCompleted){
            status.classList.add('step-completed')
        }

        //Update next status
        if(dataProp === order.status){

            stepCompleted = false;

            //Create time element
            time.innerText = moment(order.updatedAt).format('hh:mm A');
            status.appendChild(time);

            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
            }
           
        }
    })
}

updateStatus(order);