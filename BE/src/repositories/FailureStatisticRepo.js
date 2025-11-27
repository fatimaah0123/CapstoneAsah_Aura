import { Pool } from 'pg';

export class FailureStatisticRepo {
  constructor() {
    this._pool = new Pool();
  }
}

export default new FailureStatisticRepo();
