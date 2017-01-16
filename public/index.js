'use strict';

//list of cars
//useful for ALL exercises
let cars = [{
	'id': 'p306',
	'vehicule': 'peugeot 306',
	'pricePerDay': 20,
	'pricePerKm': 0.10
}, {
	'id': 'rr-sport',
	'pricePerDay': 60,
	'pricePerKm': 0.30
}, {
	'id': 'p-boxster',
	'pricePerDay': 100,
	'pricePerKm': 0.45
}];

//list of rentals
//useful for ALL exercises
//The `price` is updated from exercice 1
//The `commission` is updated from exercice 3
//The `options` is useful from exercice 4
let rentals = [{
	'id': '1-pb-92',
	'driver': {
		'firstName': 'Paul',
		'lastName': 'Bismuth'
	},
	'carId': 'p306',
	'pickupDate': '2016-01-02',
	'returnDate': '2016-01-02',
	'distance': 100,
	'options': {
		'deductibleReduction': false
	},
	'price': 0,
	'commission': {
		'insurance': 0,
		'assistance': 0,
		'drivy': 0
	}
}, {
	'id': '2-rs-92',
	'driver': {
		'firstName': 'Rebecca',
		'lastName': 'Solanas'
	},
	'carId': 'rr-sport',
	'pickupDate': '2016-01-05',
	'returnDate': '2016-01-09',
	'distance': 300,
	'options': {
		'deductibleReduction': true
	},
	'price': 0,
	'commission': {
		'insurance': 0,
		'assistance': 0,
		'drivy': 0
	}
}, {
	'id': '3-sa-92',
	'driver': {
		'firstName': ' Sami',
		'lastName': 'Ameziane'
	},
	'carId': 'p-boxster',
	'pickupDate': '2015-12-01',
	'returnDate': '2015-12-15',
	'distance': 1000,
	'options': {
		'deductibleReduction': true
	},
	'price': 0,
	'commission': {
		'insurance': 0,
		'assistance': 0,
		'drivy': 0
	}
}];

//list of actors for payment
//useful from exercise 5
let actors = [{
	'rentalId': '1-pb-92',
	'payment': [{
		'who': 'driver',
		'type': 'debit',
		'amount': 0
	}, {
		'who': 'owner',
		'type': 'credit',
		'amount': 0
	}, {
		'who': 'insurance',
		'type': 'credit',
		'amount': 0
	}, {
		'who': 'assistance',
		'type': 'credit',
		'amount': 0
	}, {
		'who': 'drivy',
		'type': 'credit',
		'amount': 0
	}]
}, {
	'rentalId': '2-rs-92',
	'payment': [{
		'who': 'driver',
		'type': 'debit',
		'amount': 0
	}, {
		'who': 'owner',
		'type': 'credit',
		'amount': 0
	}, {
		'who': 'insurance',
		'type': 'credit',
		'amount': 0
	}, {
		'who': 'assistance',
		'type': 'credit',
		'amount': 0
	}, {
		'who': 'drivy',
		'type': 'credit',
		'amount': 0
	}]
}, {
	'rentalId': '3-sa-92',
	'payment': [{
		'who': 'driver',
		'type': 'debit',
		'amount': 0
	}, {
		'who': 'owner',
		'type': 'credit',
		'amount': 0
	}, {
		'who': 'insurance',
		'type': 'credit',
		'amount': 0
	}, {
		'who': 'assistance',
		'type': 'credit',
		'amount': 0
	}, {
		'who': 'drivy',
		'type': 'credit',
		'amount': 0
	}]
}];

//list of rental modifcation
//useful for exercise 6
let rentalModifications = [{
	'rentalId': '1-pb-92',
	'returnDate': '2016-01-04',
	'distance': 150
}, {
	'rentalId': '3-sa-92',
	'pickupDate': '2015-12-05'
}];

/**
 *  @brief Updates the prices in the rentals depending
 *
 *  @param [in] cars object containing the cars list.
 *  @param [in] rentals object containing the rentals list
 *
 */
function GenerateRentalPrices(actors, cars, rentals) {
	for (let rental of rentals) {
		for (let car of cars) {
			if (car.id === rental.carId) {
				UpdateRental(car, rental);
			}
		}
		for (let actor of actors) {
			if (rental.id === actor.rentalId) {
				UpdateActor(actor, rental);
			}
		}
	}
}

/**
 * Updates the actor payments object
 *  @param [in] actor The actor payment list that should be updated
 *  @param [in] rental The rental which match the payment
 *
 */
function UpdateActor(actor, rental) {
	for (let pay of actor.payment) {
		switch (pay.who) {
			case "driver":
				pay.amount = rental.price;
				break;
			case "owner":
				pay.amount = rental.price - rental.commission.insurance - rental.commission.assistance - rental.commission.drivy;
				break;
			case "insurance":
				pay.amount = rental.commission.insurance;
				break;
			case "assistance":
				pay.amount = rental.commission.assistance;
				break;
			case "drivy":
				pay.amount = rental.commission.drivy;
				break;
			default:
				console.log("Object is malformed.");
				break;
		}
	}
}

/**
 * Updates the actor payments object
 *  @param [in] actor the car that was used by the driver
 *  @param [in] rental The rental which match the payment
 *
 */
function UpdateRental(car, rental) {
	let numberOfDays = ReturnNumberOfDays(rental.returnDate, rental.pickupDate);
	let commission;
	let additionalFee = rental.options.deductibleReduction === true ? numberOfDays * 4 : 0;

	rental.price = ComputePrice(car.pricePerDay * numberOfDays, car.pricePerKm * rental.distance, numberOfDays);
	commission = rental.price * 0.3;
	// Commission are half of the 30%
	rental.commission.insurance = commission / 2;
	// Assistance is 1€ per day
	rental.commission.assistance = numberOfDays;
	// Drivy takes the rest of the 30% + options
	rental.commission.drivy = commission - rental.commission.insurance - rental.commission.assistance + additionalFee;

	// Additional fee is added to the price at the end and not taken for commis
	rental.price += additionalFee;
}

/**
 *  @brief Return the number of days between two dates
 *
 *  @param [in] returnDate The Date the car should be returned
 *  @param [in] pickupDate The Date the car was lent to the driver
 *  @return The number of days between the two dates
 *
 */
function ReturnNumberOfDays(returnDate, pickupDate) {
	return Math.ceil(((new Date(returnDate) - new Date(pickupDate)) / (1000 * 24 * 3600))) || 1;
}

/**
 *  @brief Computes the price of the current rental
 *
 *  @param [in] time the priceTag of the time the driver has had the car
 *  @param [in] distance The distance the driver has travelled
 *  @return time + distance
 *
 */
function ComputePrice(time, distance, numberOfDays) {
	let rate;
	switch (numberOfDays) {
		case 0:
		case 1:
			rate = 1;
			break;
		case 2:
		case 3:
		case 4:
			rate = 0.9;
			break;
		case 5:
		case 6:
		case 7:
		case 8:
		case 9:
		case 10:
			rate = 0.7;
			break;
		case 11:
		default:
			rate = 0.5;
			break;
	}	
	return (+time + distance) * rate;
}

/**
 * { Updates the data in the database line by line and only the needed lines }
 *
 * @class      UpdateRentalDetails (name)
 * @param      {Object}  rentalModifications  The rental modifications
 * @param      {Object}  rentals              The rentals
 * @param      {Object}  cars                 The cars
 * @param      {Object}  actors               The actors
 */
function UpdateRentalDetails(rentalModifications, rentals, cars, actors) {
	for (let modifiedRental of rentalModifications) {
		let rental = rentals.find(r => modifiedRental.rentalId === r.id)
		let carToUpdate = cars.find(car => car.id === rental.carId)
		let actorToUpdate = actors.find(actor => rental.id === actor.rentalId)

		if (!carToUpdate || !actorToUpdate) {
			console.log("Data is malformed");
			break;
		}

		for (let key in rental) {
			// Only update if something changed.
			if (modifiedRental[key] && modifiedRental[key] !== rental[key]) {
				rental[key] = modifiedRental[key];
			}
		}
		// Update everything that changed.
		UpdateRental(carToUpdate, rental);
		UpdateActor(actorToUpdate, rental);
	}
}

GenerateRentalPrices(actors, cars, rentals);
UpdateRentalDetails(rentalModifications, rentals, cars, actors);

console.log(cars);
console.log(rentals);
console.log(actors);
console.log(rentalModifications);