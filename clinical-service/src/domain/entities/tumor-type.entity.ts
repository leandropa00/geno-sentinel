export class TumorType {
  constructor(
    public id: number,
    public name: string,
    public systemAffected: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}

