export class Location {
  country: string;
  state: string;
  latitude: number;
  longitude: number;
  cep: string;
  publicPlace: string;
  neighborhood: string;
  number: number;
  county: string;
  complement: string;

  constructor(
    country: string,
    state: string,
    latitude: number,
    longitude: number,
    cep: string,
    publicPlace: string,
    neighborhood: string,
    number: number,
    county: string,
    complement: string
  ) {
    this.country = country;
    this.state = state;
    this.latitude = latitude;
    this.longitude = longitude;
    this.cep = cep;
    this.publicPlace = publicPlace;
    this.neighborhood = neighborhood;
    this.number = number;
    this.county = county;
    this.complement = complement;
  }
}
