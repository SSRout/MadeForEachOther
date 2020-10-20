import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class MasterService {

  getCountries() {
    return [
      { id: 'IND', name: 'IND' },
      { id: 'USA', name: 'USA' },
      { id: 'AUS', name: 'AUS' },
    ];
  }

  getStates() {
    return [
      { id: 'Odisha', country_id: 'IND', name: 'Odisha' },
      { id: 'Telengana', country_id: 'IND', name: 'Telengana' },
      { id: 'Karnataka', country_id: 'IND', name: 'Karnataka' },
      { id: 'Texas', country_id: 'USA', name: 'Texas' },
      { id: 'Queensland', country_id: 'AUS', name: 'Queensland' },
      { id: 'New South Wales', country_id: 'AUS', name: 'New South Wales' },
    ];
  }

  getCity() {
    return [
      { id: 'Bhubaneswar', state_id: 'Odisha', name: 'Bhubaneswar' },
      { id: 'Cuttack', state_id: 'Odisha', name: 'Cuttack' },
      { id: 'Rourkela', state_id: 'Odisha', name: 'Rourkela' },
      { id: 'Hyderabad', state_id: 'Telengana', name: 'Hyderabad' },
      { id: 'Secunderabad', state_id: 'Telengana', name: 'Secunderabad' },
      { id: 'Banglore', state_id: 'Karnataka', name: 'Banglore' },
      { id: 'Udupi', state_id: 'Karnataka', name: 'Udupi' },
      { id: 'Austin', state_id: 'Texas', name: 'Austin' },
      { id: 'Dalas', state_id: 'Texas', name: 'Dalas' },
      { id: 'Brisbane', state_id: 'Queensland', name: 'Brisbane' },
      { id: 'Gold Cost', state_id: 'Queensland', name: 'Gold Cost' },
      { id: 'Sydney', state_id: 'New South Wales', name: 'Sydney' },
      { id: 'Orange', state_id: 'New South Wales', name: 'Orange' },
    ];
  }

  constructor() { }
}
