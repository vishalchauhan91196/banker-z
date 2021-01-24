'use strict';


const account1 = {
    owner: 'Vishal Chauhan',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, 
    pin: 1111,

    movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-12-14T23:36:17.929Z',
    '2020-12-15T10:51:36.790Z',
  ],
    currency: 'INR',
};

const account2 = {
    owner: 'Kritika Kalia',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-12-13T18:49:59.371Z',
    '2020-12-16T12:01:20.894Z',
  ],
    currency: 'INR',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


/////////////////////////////////////////////////
//////  Functions

const createUserName = function (acnts) {
    acnts.forEach(function (acnt) {
        acnt.userName = acnt.owner //creating a new property username in every account.
            .toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('');
    })
}
createUserName(accounts);


const formatMovementDate = function (date) {
    const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

    const daysPassed = calcDaysPassed(new Date(), date);
    console.log(daysPassed);

    if (daysPassed === 0) return 'Today';
    if (daysPassed === 1) return 'Yesterday';
    if (daysPassed < 7) return `${daysPassed} days ago`;
    else {
        const day = `${date.getDate()}`.padStart(2, 0);
        const month = `${date.getMonth() + 1}`.padStart(2, 0);
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
}

const startLogoutTimer = function () {
    // Set timer to 5 mins
    let time = 150;

    // Call timer every second
    const timer = setInterval(function () {
        // In each call, print the time to UI
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);

        labelTimer.textContent = `${min}:${sec}`;

        // When 0 sec, stop timer and logout
        if (time === 0) {
            clearInterval(timer);
            containerApp.style.opacity = 0;
            labelWelcome.textContent = 'Login to get started';
        }

        // Decrease timer by 1 second
        time--;
    }, 1000);
    console.log(timer);
    return timer;
}

const displayMovements = function (acc, sort = false) {
    containerMovements.innerHTML = '';

    const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

    movs.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        const date = new Date(acc.movementsDates[i]);
        const displayDate = formatMovementDate(date);
        console.log(displayDate);

        const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${mov.toFixed(2)} ₹ </div>
        </div>
    `;

        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};

const calcDisplayBalance = function (account) {
    const balance = account.movements.reduce((acc, mov) => acc + mov, 0);
    account.balance = balance;
    labelBalance.textContent = `${account.balance.toFixed(2)} ₹`;
};


const calcDisplaySummary = function (account) {
    const incomes = account.movements
        .filter(deposit => deposit > 0)
        .reduce((acc, deposit) => acc + deposit, 0);
    labelSumIn.textContent = `${incomes.toFixed(2)} ₹`;

    const out = account.movements
        .filter(deposit => deposit < 0)
        .reduce((acc, deposit) => acc + deposit, 0);
    labelSumOut.textContent = `${Math.abs(out).toFixed(2)} ₹`;

    const interest = account.movements
        .filter(deposit => deposit > 0)
        .map(deposit => (deposit * account.interestRate) / 100)
        .filter(int => int >= 1) // interest amount should be greater than 1
        .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = `${interest.toFixed(2)} ₹`;

};

const updateUI = function (account) {
    // Display movements
    displayMovements(account);

    // Display balance
    calcDisplayBalance(account);

    // Display summary 
    calcDisplaySummary(account);
}

///////////////////////////////////////////////////////////////////
////////////    EVENT HANDLERS    //////////////////


let currentAccount, timer;

// Fake LOGIN

//currentAccount = account1;
//updateUI(currentAccount);
//containerApp.style.opacity = 100;

// Login
btnLogin.addEventListener('click', function (event) {
    event.preventDefault(); // to prevent submitting form imdtly when btn is clicked.

    currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);
    console.log(currentAccount);

    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        //Display UI and message 
        containerApp.style.opacity = 100;
        labelWelcome.textContent = `Welcome back`;
    } else {
        alert('Wrong Username or Password! Try again.');
    }

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Creating dates
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hours = `${now.getHours()}`.padStart(2, 0);
    const minutes = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = `${day}/${month} ${year}, ${hours}:${minutes}`;

    // Start Timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Update UI
    updateUI(currentAccount);

});

//Implementing transfers
btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = +inputTransferAmount.value;
    const receiverAcc = accounts.find(acc => acc.userName === inputTransferTo.value);
    console.log(amount, receiverAcc);

    if (amount > 0 &&
        receiverAcc &&
        currentAccount.balance > amount &&
        receiverAcc.userName !== currentAccount.userName) {

        // Doing the transfer
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);

        // Add transfer date
        currentAccount.movementsDates.push(new Date().toISOString());
        receiverAcc.movementsDates.push(new Date().toISOString());

        // update UI
        updateUI(currentAccount);

        // Reset timer 
        clearInterval(timer);
        timer = startLogoutTimer();

    } else
        alert('Invalid transfer');

    // Clear input fields
    inputTransferAmount.value = inputTransferTo.value = '';

});


//Request LOAN 
btnLoan.addEventListener('click', function (e) {
    e.preventDefault();

    const requestedAmount = +inputLoanAmount.value;
    if (requestedAmount > 0 && currentAccount.movements.some(acc => acc * 0.1 > requestedAmount)) {

        setTimeout(function () {
            currentAccount.movements.push(Math.floor(requestedAmount));
            // Add loan date
            currentAccount.movementsDates.push(new Date().toISOString());
            // Update UI
            updateUI(currentAccount);
            // Reset timer 
            clearInterval(timer);
            timer = startLogoutTimer();
        }, 3000);


    } else {
        alert('Loan can not be granted. Your account does not fulfill the conditions');
    }

    // Clear input fields
    inputLoanAmount.value = '';

});




//CLOSE ACCOUNT
btnClose.addEventListener('click', function (e) {
    e.preventDefault();

    if (inputCloseUsername.value === currentAccount.userName &&
        +inputClosePin.value === currentAccount.pin
    ) {
        const index = accounts.findIndex(acc => acc.userName === currentAccount.userName);

        //Delete account
        accounts.splice(index, 1);

        // Hide UI
        containerApp.style.opacity = 0;
        alert('Your account has been deleted');

    } else {
        alert('Wrong Username or PIN');
    }

    // Clear input fields 
    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();
});


// Sorting
let sorted = false;
btnSort.addEventListener('click', function (e) {
    e.preventDefault();

    displayMovements(currentAccount, !sorted);
    sorted = !sorted;
});



/////////////////////////////////////////////////
/////////////////////////////////////////////////

