import { PythonShell } from 'python-shell';
import FailureStatisticRepo from '../repositories/FailureStatisticRepo.js';
import MaintenanceRecommendationRepo from '../repositories/MaintenanceRecommendationRepo.js';

class PredictService {
  rulPredict(inputData) {
    const pyPath = './src/models/script/rul.py';
    const options = {
      mode: 'text',
      pythonOptions: ['-u'],
    };

    return new Promise((resolve, reject) => {
      try {
        const pyshell = new PythonShell(pyPath, options);

        pyshell.send(JSON.stringify(inputData));

        let result = '';

        pyshell.on('message', (message) => {
          result += message;
        });

        pyshell.on('error', (error) => {
          reject(error);
        });

        pyshell.end((err) => {
          if (err) reject(err);
          else resolve(result);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new PredictService();
