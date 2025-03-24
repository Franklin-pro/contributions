export interface User {
    id:        number;
    fullName:  string;
    email:     string;
    firstName: string;
    lastName:  string;
    gender:    string;
    image:     string;
    token:     string;
    role:String;
    user:any;
    message:String;
    data:any,
    password:string;
    phoneNumber:string;
    houseNumber:string;
    streetNumber:string;
    city:string;
    address:string;
}

export interface Tracking {
    id:        number;
    userId:    number;
    productId: number;
    createdAt: Date;
    updatedAt: Date;
    user:      User;

}

export interface Login {
    // message:String;
    email:  string;
    password:string;
   
}

export interface ParsedContent {
    id: number;
    title: string;
    content: string;
    // add other properties as needed
}

export interface Create {
    fullName:  string;
    password:string;
    email: string;
    phoneNumber:string;
    houseNumber:string;
    streetNumber:string;
    city:string;
    address:string;
    
}

export interface Customer {
    id:         number;
    firstName:  string;
    lastName:   string;
    maidenName: string;
    age:        number;
    gender:     string;
    email:      string;
    phone:      string;
    username:   string;
    password:   string;
    birthDate:  Date;
    image:      string;
    bloodGroup: string;
    height:     number;
    weight:     number;
    eyeColor:   string;
    hair:       Hair;
    domain:     string;
    ip:         string;
    address:    Address;
    macAddress: string;
    university: string;
    bank:       Bank;
    company:    Company;
    ein:        string;
    ssn:        string;
    userAgent:  string;
}

export interface Address {
    address:     string;
    city:        string;
    coordinates: Coordinates;
    postalCode:  string;
    state:       string;
}

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Bank {
    cardExpire: string;
    cardNumber: string;
    cardType:   string;
    currency:   string;
    iban:       string;
}

export interface Company {
    address:    Address;
    department: string;
    name:       string;
    title:      string;
}

export interface Hair {
    color: string;
    type:  string;
}
