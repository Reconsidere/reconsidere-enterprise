export class Resource {
  text: string;
  id: number;
  color: string;
  constructor(id: number, text: string, color: string) {
    this.text = text;
    this.id = id;
    this.color = color;
  }
}
