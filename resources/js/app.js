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

    //Remove old classes
    statuses.forEach((status) =>{
        status.classList.remove('step-completed');
        status.classList.remove('current');
    })

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

//Client side socket connection

let socket = io();

//join room by name (name: order_dkfsf87897kjdfjj).
//Check if order exists
if (order) {
    socket.emit('join', `order_${order._id}`);
};

//Add new orders in admin order list page in real time
let adminAreaPath = window.location.pathname;

if(adminAreaPath.includes('admin')){
    initAdmin(socket);
    socket.emit('join', 'adminRoom');
}

//Listen for order updated event
socket.on('orderUpdated', (data) =>{
    //make a copy of order
    const updatedOrder = { ...order };

    //update time of order to current time
    updatedOrder.updatedAt = moment().format();

    //update status of order
    updatedOrder.status = data.status;

    //Update status
    updateStatus(updatedOrder);

    //Success messages pop up
    new Noty({
        type: "success",
        timeout: 1000,
        progressBar: false,
        closeWith: ['click'],
        text: "Order updated!"
    }).show();
})