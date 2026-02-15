export class GeneralException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeneralException";
  }
}
